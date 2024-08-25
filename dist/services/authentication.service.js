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
exports.AuthenticationService = void 0;
const custom_error_1 = __importDefault(require("../utils/custom-error"));
const jwt_utils_1 = require("../utils/jwt.utils");
const passwordHashing_1 = require("../utils/passwordHashing");
const validation_utils_1 = require("../utils/validation-utils");
const token_repository_1 = require("../repositories/token.repository");
const database_1 = __importDefault(require("../config/database"));
const user_repository_1 = require("../repositories/user.repository");
const error_1 = require("../messages/error");
class AuthenticationService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
        this.tokenCacheService = new token_repository_1.TokenCacheService();
    }
    validateRegisterData(data) {
        (0, validation_utils_1.validateRequiredFields)(data, ["email", "username", "password"]);
        (0, validation_utils_1.validateEmail)(data.email);
        (0, validation_utils_1.validateUsername)(data.username);
        (0, validation_utils_1.passwordValidator)(data.password);
    }
    checkForExistingUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.userRepository.findByEmail(data.email)) {
                throw new custom_error_1.default("Email already exists", 409);
            }
            if (yield this.userRepository.findByUsername(data.username)) {
                throw new custom_error_1.default("Username already exists", 409);
            }
        });
    }
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateRegisterData(data);
            yield this.checkForExistingUser(data);
            data.password = yield (0, passwordHashing_1.hashPassword)(data.password);
            const user = yield this.userRepository.createUser(data);
            return yield (0, jwt_utils_1.generateAuthTokens)(user.id);
        });
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_utils_1.validateRequiredFields)(data, ["emailOrUsername", "password"]);
            const user = yield database_1.default.user.findFirst({
                where: {
                    OR: [
                        { email: data.emailOrUsername },
                        { username: data.emailOrUsername },
                    ],
                },
            });
            if (!user || !(yield (0, passwordHashing_1.verifyPassword)(data.password, user.password))) {
                throw new custom_error_1.default("Invalid email or password", 401);
            }
            return yield (0, jwt_utils_1.generateAuthTokens)(user.id);
        });
    }
    refreshAccessToken(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { refreshToken: refreshTokenJWT } = data;
            const decoded = yield (0, jwt_utils_1.verifyRefresh)(refreshTokenJWT);
            const { refreshToken: refresh, id } = decoded;
            yield this.userRepository.findById(id);
            const token = yield this.tokenCacheService.getRefreshToken(id);
            if (!(yield (0, passwordHashing_1.verifyPassword)(refresh, token))) {
                throw new custom_error_1.default(error_1.invalidToken.message, error_1.invalidToken.code);
            }
            return yield (0, jwt_utils_1.generateAuthTokens)(id);
        });
    }
}
exports.AuthenticationService = AuthenticationService;
