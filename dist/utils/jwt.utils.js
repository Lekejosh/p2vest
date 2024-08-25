"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenDecode = exports.verifyRefresh = exports.verifyAccess = exports.generateAuthTokens = void 0;
const config_1 = require("../config");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const redis_1 = __importDefault(require("../config/database/redis"));
const generateAuthTokens = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield sign(userId);
    const hex = crypto_1.default.randomBytes(32).toString("hex");
    const refreshToken = yield token.refresh(hex);
    const hash = yield bcryptjs_1.default.hash(hex, 10);
    yield redis_1.default.del(`${userId}:refresh`);
    yield redis_1.default.setex(`${userId}:refresh`, 1800, `${hash}`);
    const access = yield token.access();
    return { accessToken: access, refreshToken };
});
exports.generateAuthTokens = generateAuthTokens;
const sign = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const access = () => __awaiter(void 0, void 0, void 0, function* () {
        return jsonwebtoken_1.default.sign({ id: userId }, config_1.JWT_SECRET, {
            expiresIn: "10 mins",
            issuer: config_1.APP_NAME,
            audience: config_1.APP_NAME,
        });
    });
    const refresh = (token) => __awaiter(void 0, void 0, void 0, function* () {
        const refresh = {
            id: userId,
            refreshToken: token,
        };
        return jsonwebtoken_1.default.sign(refresh, config_1.JWT_SECRET, {
            expiresIn: "30 mins",
            issuer: config_1.APP_NAME,
            audience: config_1.APP_NAME,
        });
    });
    return { access, refresh };
});
const verifyAccess = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
});
exports.verifyAccess = verifyAccess;
const verifyRefresh = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
});
exports.verifyRefresh = verifyRefresh;
const tokenDecode = (token) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.decode(token);
});
exports.tokenDecode = tokenDecode;
