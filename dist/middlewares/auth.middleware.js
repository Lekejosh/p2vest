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
const custom_error_1 = __importDefault(require("../utils/custom-error"));
const jwt_utils_1 = require("../utils/jwt.utils");
const token_repository_1 = require("../repositories/token.repository");
const error_1 = require("../messages/error");
const user_repository_1 = require("../repositories/user.repository");
/**
 * If no role is passed the default role is user
 *
 * @param  {any[]} roles List of roles allowed to access the route
 */
const auth = (roles = []) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.headers.authorization)
            throw new custom_error_1.default("unauthorized access: Token not found", 403);
        const token = req.headers.authorization.split(" ")[1];
        if (yield new token_repository_1.TokenCacheService().findBlacklistedToken(token))
            throw new custom_error_1.default(error_1.invalidToken.message, 403);
        const decoded = yield (0, jwt_utils_1.verifyAccess)(token);
        const user = yield new user_repository_1.UserRepository().findById(decoded.id);
        if (!user)
            throw new custom_error_1.default("unauthorized access: User does not exist", 401);
        if (!roles.includes(user.role))
            throw new custom_error_1.default("unauthorized access", 401);
        req.$user = user;
        next();
    });
};
exports.default = auth;
