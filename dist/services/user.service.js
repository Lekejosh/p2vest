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
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const user_repository_1 = require("../repositories/user.repository");
const custom_error_1 = __importDefault(require("../utils/custom-error"));
const passwordHashing_1 = require("../utils/passwordHashing");
const validation_utils_1 = require("../utils/validation-utils");
class UserService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
    }
    validateRegisterData(data) {
        (0, validation_utils_1.validateRequiredFields)(data, ["email", "username", "password", "role"]);
        (0, validation_utils_1.validateEmail)(data.email);
        (0, validation_utils_1.validateUsername)(data.username);
        (0, validation_utils_1.passwordValidator)(data.password);
        if (data.role && !Object.values(client_1.Role).includes(data.role)) {
            throw new custom_error_1.default("Role is not a valid type", 422);
        }
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
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateRegisterData(data);
            yield this.checkForExistingUser(data);
            data.password = yield (0, passwordHashing_1.hashPassword)(data.password);
            const user = yield this.userRepository.createUser(data);
            return;
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.getUsers();
        });
    }
}
exports.UserService = UserService;
