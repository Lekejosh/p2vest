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
exports.TokenCacheService = void 0;
const redis_1 = __importDefault(require("../config/database/redis"));
const custom_error_1 = __importDefault(require("../utils/custom-error"));
const jwt_utils_1 = require("../utils/jwt.utils");
const user_repository_1 = require("./user.repository");
const error_1 = require("../messages/error");
class TokenCacheService {
    constructor() {
        this.agentRepository = new user_repository_1.UserRepository();
    }
    getRefreshToken(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield redis_1.default.get(`${id}:refresh`);
            if (!token) {
                throw new custom_error_1.default(error_1.invalidToken.message, error_1.invalidToken.code);
            }
            return token;
        });
    }
    setPasswordTokenForInvite(id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            yield redis_1.default.del(`${id}:password`);
            yield redis_1.default.setex(`${id}:password`, 86400, `${token}`);
            return true;
        });
    }
    tokenBlacklist(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoded = yield (0, jwt_utils_1.tokenDecode)(token);
            const currentTime = Math.floor(Date.now() / 1000);
            const exp = decoded.exp;
            const timeLeft = exp - currentTime;
            if (timeLeft <= 0) {
                return;
            }
            yield redis_1.default.setex(token, timeLeft, token);
            return;
        });
    }
    findBlacklistedToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield redis_1.default.get(token);
        });
    }
}
exports.TokenCacheService = TokenCacheService;
