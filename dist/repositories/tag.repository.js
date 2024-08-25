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
exports.TagRepository = void 0;
const client_1 = require("@prisma/client");
const redis_1 = __importDefault(require("../config/database/redis"));
class TagRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
        this.redis = redis_1.default;
    }
    cacheTag(id, tag) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redis.set(`tag:${id}`, JSON.stringify(tag), "EX", 600);
        });
    }
    getCachedTag(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedTag = yield this.redis.get(`tag:${id}`);
            return cachedTag ? JSON.parse(cachedTag) : null;
        });
    }
    createTag(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const tag = yield this.prisma.tag.create({
                data: Object.assign({}, data),
            });
            yield this.cacheTag(tag.id, tag);
            return tag;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedTag = yield this.getCachedTag(id);
            if (cachedTag)
                return cachedTag;
            const tag = yield this.prisma.tag.findUnique({
                where: { id },
            });
            if (tag) {
                yield this.cacheTag(id, tag);
                return tag;
            }
            return null;
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedTag = yield this.redis.get(`tag:name:${name}`);
            if (cachedTag)
                return JSON.parse(cachedTag);
            const tag = yield this.prisma.tag.findUnique({
                where: { name },
            });
            if (tag) {
                yield this.redis.set(`tag:name:${name}`, JSON.stringify(tag), "EX", 3600);
                return tag;
            }
            return null;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedTags = yield this.redis.get(`tags:all`);
            if (cachedTags)
                return JSON.parse(cachedTags);
            const tags = yield this.prisma.tag.findMany();
            if (tags.length > 0) {
                yield this.redis.set(`tags:all`, JSON.stringify(tags), "EX", 3600);
            }
            return tags;
        });
    }
    updateTag(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedTag = yield this.prisma.tag.update({
                where: { id },
                data,
            });
            if (updatedTag) {
                yield this.cacheTag(id, updatedTag);
                return updatedTag;
            }
            return null;
        });
    }
    deleteTag(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedTag = yield this.prisma.tag.delete({
                where: { id },
            });
            if (deletedTag) {
                yield this.redis.del(`tag:${id}`);
                return deletedTag;
            }
            return null;
        });
    }
    ensureDefaultTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultTags = ["urgent", "bug", "feature"];
            for (const tagName of defaultTags) {
                const tagExists = yield this.findByName(tagName);
                if (!tagExists) {
                    yield this.createTag({ name: tagName });
                }
            }
        });
    }
}
exports.TagRepository = TagRepository;
