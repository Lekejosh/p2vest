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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const client_1 = require("@prisma/client");
const redis_1 = __importDefault(require("../config/database/redis"));
class UserRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
        this.redis = redis_1.default;
    }
    excludePassword(user) {
        const { password } = user, userWithoutPassword = __rest(user, ["password"]);
        return userWithoutPassword;
    }
    cacheUser(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redis.set(id, JSON.stringify(user), "EX", 3000);
        });
    }
    getCachedUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedUser = yield this.redis.get(id);
            return cachedUser ? JSON.parse(cachedUser) : null;
        });
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prisma.user.create({
                data: {
                    username: data.username,
                    email: data.email,
                    password: data.password,
                },
            });
            const userWithoutPassword = this.excludePassword(user);
            yield this.cacheUser(user.id, userWithoutPassword);
            return userWithoutPassword;
        });
    }
    createUserAdmin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.prisma.user.create({
                data: Object.assign({}, data),
            });
            const userWithoutPassword = this.excludePassword(user);
            yield this.cacheUser(user.id, userWithoutPassword);
            return userWithoutPassword;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedUser = yield this.getCachedUser(id);
            if (cachedUser)
                return cachedUser;
            const user = yield this.prisma.user.findUnique({
                where: { id },
            });
            if (user) {
                const userWithoutPassword = this.excludePassword(user);
                yield this.cacheUser(id, userWithoutPassword);
                return userWithoutPassword;
            }
            return null;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedUser = yield this.redis.get(`email:${email}`);
            if (cachedUser)
                return JSON.parse(cachedUser);
            const user = yield this.prisma.user.findUnique({
                where: { email },
            });
            if (user) {
                const userWithoutPassword = this.excludePassword(user);
                yield this.redis.set(`email:${email}`, JSON.stringify(userWithoutPassword), "EX", 3600);
                return userWithoutPassword;
            }
            return null;
        });
    }
    findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedUser = yield this.redis.get(`username:${username}`);
            if (cachedUser)
                return JSON.parse(cachedUser);
            const user = yield this.prisma.user.findUnique({
                where: { username },
            });
            if (user) {
                const userWithoutPassword = this.excludePassword(user);
                yield this.redis.set(`username:${username}`, JSON.stringify(userWithoutPassword), "EX", 3600);
                return userWithoutPassword;
            }
            return null;
        });
    }
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield this.prisma.user.update({
                where: { id },
                data,
            });
            if (updatedUser) {
                const userWithoutPassword = this.excludePassword(updatedUser);
                yield this.cacheUser(id, userWithoutPassword);
                return userWithoutPassword;
            }
            return null;
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.prisma.user.findMany({});
            const usersWithoutPassword = users.map((user) => this.excludePassword(user));
            return usersWithoutPassword;
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedUser = yield this.prisma.user.delete({
                where: { id },
            });
            if (deletedUser) {
                yield this.redis.del(id);
                return this.excludePassword(deletedUser);
            }
            return null;
        });
    }
}
exports.UserRepository = UserRepository;
