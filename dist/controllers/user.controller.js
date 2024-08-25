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
const response_1 = __importDefault(require("../utils/response"));
const user_service_1 = require("../services/user.service");
class UserController {
    constructor() {
        this.getMe = (req, res) => __awaiter(this, void 0, void 0, function* () {
            return res.status(200).send((0, response_1.default)("User", req.$user));
        });
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userService.createUser(req.body);
            return res.status(201).send((0, response_1.default)("User created Successfully", result));
        });
        this.getUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userService.getUsers();
            return res.status(200).send((0, response_1.default)("Users", result));
        });
        this.userService = new user_service_1.UserService();
    }
}
exports.default = new UserController();
