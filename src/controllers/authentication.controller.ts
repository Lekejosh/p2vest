import { Request, Response } from "express";
import { AuthenticationService } from "../services/authentication.service";
import response from "../utils/response";
import CustomError from "../utils/custom-error";
import { TokenCacheService } from "../repositories/token.repository";

class AuthenticationController {
  private authenticationService: AuthenticationService;
  private tokenCacheService: TokenCacheService;

  constructor() {
    this.authenticationService = new AuthenticationService();
    this.tokenCacheService = new TokenCacheService();
  }

  public register = async (req: Request, res: Response) => {
    const result = await this.authenticationService.register(req.body);
    const time = 40 * 60;
    const expires = new Date(Date.now() + time * 1000);
    res.cookie("refreshToken", result.refreshToken, {
      expires,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    const data = {
      accessToken: result.accessToken,
    };
    return res.status(201).send(response("User created successfully", data));
  };
  public login = async (req: Request, res: Response) => {
    const result = await this.authenticationService.login(req.body);
    const time = 40 * 60;
    const expires = new Date(Date.now() + time * 1000);
    res.cookie("refreshToken", result.refreshToken, {
      expires,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    const data = {
      accessToken: result.accessToken,
    };
    return res.status(200).send(response("Login successful", data));
  };
  public refreshToken = async (req: Request, res: Response) => {
    if (!req.headers.authorization)
      throw new CustomError("unauthorized access: Token not found", 401);
    const result = await this.authenticationService.refreshAccessToken({
      refreshToken: req.cookies["refreshToken"],
    });
    const time = 40 * 60;
    const expires = new Date(Date.now() + time * 1000);
    res.clearCookie("refreshToken");
    res.cookie("refreshToken", result.refreshToken, {
      expires,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    const token = req.headers.authorization!.split(" ")[1] as string;
    await this.tokenCacheService.tokenBlacklist(token);
    const data = {
      accessToken: result.accessToken,
    };
    return res
      .status(200)
      .send(response("access token refreshed successfully", data));
  };
}

export default new AuthenticationController();
