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
const taskTag_service_1 = require("../services/taskTag.service");
const response_1 = __importDefault(require("../utils/response"));
class TaskTagController {
    constructor() {
        this.addTagToTask = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.taskTagService.addTagToTask(req.params.id, req.body, req.$user.id);
            return res.status(200).send((0, response_1.default)("Task tagged", result));
        });
        this.removeTagFromTask = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.taskTagService.removeTagFromTask(req.params.id, req.body, req.$user.id);
            return res.status(204).end();
        });
        this.getTagsForTask = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.taskTagService.getTagsForTask(req.params.id);
            return res.status(200).send((0, response_1.default)("Tags", result));
        });
        this.removeAllTagsFromTask = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.taskTagService.removeAllTagsFromTask(req.params.id, req.$user.id);
            return res.status(204).end();
        });
        this.taskTagService = new taskTag_service_1.TaskTagService();
    }
}
exports.default = new TaskTagController();
