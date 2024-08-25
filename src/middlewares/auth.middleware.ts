import type { Request, Response, NextFunction } from "express";
import ms from "ms";
import CustomError from "../utils/custom-error";
import { verifyAccess } from "../utils/jwt.utils";
import { TokenCacheService } from "../repositories/token.repository";
import { invalidToken } from "../messages/error";
import { UserRepository } from "../repositories/user.repository";
import { User } from "@prisma/client";

/**
 * If no role is passed the default role is user
 *
 * @param  {any[]} roles List of roles allowed to access the route
 */
const auth = (roles: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization)
      throw new CustomError("unauthorized access: Token not found", 403);
    const token = req.headers.authorization.split(" ")[1];
    if (await new TokenCacheService().findBlacklistedToken(token))
      throw new CustomError(invalidToken.message, 403);
    const decoded = await verifyAccess(token);

    const user: Omit<User, "password"> | null =
      await new UserRepository().findById(decoded.id);

    if (!user)
      throw new CustomError("unauthorized access: User does not exist", 401);

    if (!roles.includes(user.role))
      throw new CustomError("unauthorized access", 401);

    req.$user = user;
    next();
  };
};

export default auth;
