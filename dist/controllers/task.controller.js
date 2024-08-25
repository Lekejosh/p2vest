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
const task_service_1 = require("../services/task.service");
class TaskController {
    constructor() {
        this.create = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.taskService.create(req.body, req.$user.id);
            return res.status(201).send((0, response_1.default)("Task Created", result));
        });
        this.getTask = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.taskService.getTask(req.params.id);
            return res.status(200).send((0, response_1.default)("Task", result));
        });
        this.updateTask = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.taskService.updateTask(req.params.id, req.body, req.$user);
            return res.status(200).send((0, response_1.default)("Task", result));
        });
        this.deleteTask = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.taskService.deleteTask(req.params.id);
            return res.status(204).end();
        });
        //   public getStatus = async (req: Request, res: Response) => {
        //     const result = await this.taskService.getTasksByStatus(req.query.status);
        //     return res.status(200).send(response("Task", result));
        //   };
        this.assignTask = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.taskService.assignTask(req.params.id, req.body);
            return res.status(200).send((0, response_1.default)("Task", result));
        });
        this.getTasks = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.taskService.getTasksByUser(req.params.id, req.query);
            return res.status(200).send((0, response_1.default)("Tasks", result));
        });
        this.taskService = new task_service_1.TaskService();
    }
}
exports.default = new TaskController();
