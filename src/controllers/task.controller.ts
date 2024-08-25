import { Request, Response } from "express";
import response from "../utils/response";
import { TaskService } from "../services/task.service";

class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  public create = async (req: Request, res: Response) => {
    const result = await this.taskService.create(req.body, req.$user!.id);
    return res.status(201).send(response("Task Created", result));
  };

  public getTask = async (req: Request, res: Response) => {
    const result = await this.taskService.getTask(req.params.id);
    return res.status(200).send(response("Task", result));
  };
  public updateTask = async (req: Request, res: Response) => {
    const result = await this.taskService.updateTask(req.params.id, req.body,req.$user!);
    return res.status(200).send(response("Task", result));
  };
  public deleteTask = async (req: Request, res: Response) => {
    const result = await this.taskService.deleteTask(req.params.id);
    return res.status(204).end();
  };
;
  public assignTask = async (req: Request, res: Response) => {
    const result = await this.taskService.assignTask(req.params.id, req.body);
    return res.status(200).send(response("Task", result));
  };
  public getTasks = async (req: Request, res: Response) => {
    const result = await this.taskService.getTasksByUser(
      req.params.id,
      req.query,
    );
    return res.status(200).send(response("Tasks", result));
  };
}

export default new TaskController();
