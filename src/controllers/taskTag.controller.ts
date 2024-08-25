import { Request, Response } from "express";
import { TaskTagService } from "../services/taskTag.service";
import response from "../utils/response";

class TaskTagController {
  private taskTagService: TaskTagService;

  constructor() {
    this.taskTagService = new TaskTagService();
  }
  public addTagToTask = async (req: Request, res: Response) => {
    const result = await this.taskTagService.addTagToTask(
      req.params.id,
      req.body,
      req.$user!.id,
    );
    return res.status(200).send(response("Task tagged", result));
  };
  public removeTagFromTask = async (req: Request, res: Response) => {
    await this.taskTagService.removeTagFromTask(
      req.params.id,
      req.body,
      req.$user!.id,
    );
    return res.status(204).end();
  };
  public getTagsForTask = async (req: Request, res: Response) => {
    const result = await this.taskTagService.getTagsForTask(req.params.id);
    return res.status(200).send(response("Tags", result));
  };
  public removeAllTagsFromTask = async (req: Request, res: Response) => {
    await this.taskTagService.removeAllTagsFromTask(
      req.params.id,
      req.$user!.id,
    );
    return res.status(204).end();
  };
}

export default new TaskTagController();
