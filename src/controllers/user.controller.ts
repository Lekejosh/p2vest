import { Request, Response } from "express";
import response from "../utils/response";
import { UserService } from "../services/user.service";

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public getMe = async (req: Request, res: Response) => {
    return res.status(200).send(response("User", req.$user));
  };

  public create = async (req: Request, res: Response) => {
    const result = await this.userService.createUser(req.body);
    return res.status(201).send(response("User created Successfully", result));
  };
  public getUsers = async (req: Request, res: Response) => {
    const result = await this.userService.getUsers();
    return res.status(200).send(response("Users", result));
  };
}

export default new UserController();
