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
const comment_service_1 = require("../services/comment.service");
class CommentController {
    constructor() {
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentService.create(req.params.id, req.body, req.$user.id);
            return res.status(201).send((0, response_1.default)("Comment Added", result));
        });
        this.getComments = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentService.getComments(req.params.id);
            return res.status(200).send((0, response_1.default)("Comments", result));
        });
        this.getComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentService.getComment(req.params.id);
            return res.status(200).send((0, response_1.default)("Comment", result));
        });
        this.updateComment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentService.edit(req.params.id, req.$user.id, req.body);
            return res.status(200).send((0, response_1.default)("Comment update", result));
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentService.delete(req.params.id, req.$user.id);
            return res.status(204).end();
        });
        this.commentService = new comment_service_1.CommentService();
    }
}
exports.default = new CommentController();
