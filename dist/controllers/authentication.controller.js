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
const authentication_service_1 = require("../services/authentication.service");
const response_1 = __importDefault(require("../utils/response"));
const custom_error_1 = __importDefault(require("../utils/custom-error"));
const token_repository_1 = require("../repositories/token.repository");
class AuthenticationController {
    constructor() {
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authenticationService.register(req.body);
            const time = 40 * 60;
            const expires = new Date(Date.now() + time * 1000);
            res.cookie("refreshToken", result.refreshToken, {
                expires,
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            const data = {
                accessToken: result.accessToken,
            };
            return res.status(201).send((0, response_1.default)("User created successfully", data));
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.authenticationService.login(req.body);
            const time = 40 * 60;
            const expires = new Date(Date.now() + time * 1000);
            res.cookie("refreshToken", result.refreshToken, {
                expires,
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            const data = {
                accessToken: result.accessToken,
            };
            return res.status(200).send((0, response_1.default)("Login successful", data));
        });
        this.refreshToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.headers.authorization)
                throw new custom_error_1.default("unauthorized access: Token not found", 401);
            const result = yield this.authenticationService.refreshAccessToken({
                refreshToken: req.cookies["refreshToken"],
            });
            const time = 40 * 60;
            const expires = new Date(Date.now() + time * 1000);
            res.clearCookie("refreshToken");
            res.cookie("refreshToken", result.refreshToken, {
                expires,
                httpOnly: true,
                sameSite: "none",
                secure: true,
            });
            const token = req.headers.authorization.split(" ")[1];
            yield this.tokenCacheService.tokenBlacklist(token);
            const data = {
                accessToken: result.accessToken,
            };
            return res
                .status(200)
                .send((0, response_1.default)("access token refreshed successfully", data));
        });
        this.authenticationService = new authentication_service_1.AuthenticationService();
        this.tokenCacheService = new token_repository_1.TokenCacheService();
    }
}
exports.default = new AuthenticationController();
