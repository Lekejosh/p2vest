import { Request, Response } from "express";
import response from "../utils/response";
import { CommentService } from "../services/comment.service";

class CommentController {
  private commentService: CommentService;

  constructor() {
    this.commentService = new CommentService();
  }

  public create = async (req: Request, res: Response) => {
    const result = await this.commentService.create(
      req.params.id,
      req.body,
      req.$user!.id,
    );
    return res.status(201).send(response("Comment Added", result));
  };

  public getComments = async (req: Request, res: Response) => {
    const result = await this.commentService.getComments(req.params.id);
    return res.status(200).send(response("Comments", result));
  };
  public getComment = async (req: Request, res: Response) => {
    const result = await this.commentService.getComment(req.params.id);
    return res.status(200).send(response("Comment", result));
  };
  public updateComment = async (req: Request, res: Response) => {
    const result = await this.commentService.edit(
      req.params.id,
      req.$user!.id,
      req.body,
    );
    return res.status(200).send(response("Comment update", result));
  };
  public delete = async (req: Request, res: Response) => {
    const result = await this.commentService.delete(
      req.params.id,
      req.$user!.id,
    );
    return res.status(204).end();
  };
}

export default new CommentController();
