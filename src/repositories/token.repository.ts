import client from "../config/database/redis";
import CustomError from "../utils/custom-error";
import { tokenDecode } from "../utils/jwt.utils";
import { UserRepository } from "./user.repository";
import { invalidToken } from "../messages/error";

export class TokenCacheService {
  private agentRepository: UserRepository;

  constructor() {
    this.agentRepository = new UserRepository();
  }

  public async getRefreshToken(id: string): Promise<string> {
    const token = await client.get(`${id}:refresh`);
    if (!token) {
      throw new CustomError(invalidToken.message, invalidToken.code);
    }
    return token;
  }

  public async setPasswordTokenForInvite(
    id: string,
    token: string,
  ): Promise<boolean> {
    await client.del(`${id}:password`);
    await client.setex(`${id}:password`, 86400, `${token}`);
    return true;
  }
  public async tokenBlacklist(token: string) {
    const decoded = await tokenDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    const exp = decoded.exp;
    const timeLeft = exp! - currentTime;

    if (timeLeft <= 0) {
      return;
    }
    await client.setex(token, timeLeft, token);
    return;
  }
  public async findBlacklistedToken(token: string) {
    return await client.get(token);
  }
}
