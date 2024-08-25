import { randomBytes } from "crypto";

import CustomError from "../utils/custom-error";
import { generateAuthTokens, verifyRefresh } from "../utils/jwt.utils";
import { hashPassword, verifyPassword } from "../utils/passwordHashing";
import {
  passwordValidator,
  validateEmail,
  validateRequiredFields,
  validateUsername,
} from "../utils/validation-utils";
import { TokenCacheService } from "../repositories/token.repository";

import model from "../config/database";
import { UserRepository } from "../repositories/user.repository";
import { ILogin, IUserRegister } from "../@types/user";
import { IRefeshToken } from "../@types/token";
import { invalidToken } from "../messages/error";

export class AuthenticationService {
  private userRepository = new UserRepository();
  private tokenCacheService = new TokenCacheService();

  private validateRegisterData(data: IUserRegister) {
    validateRequiredFields(data, ["email", "username", "password"]);
    validateEmail(data.email);
    validateUsername(data.username);
    passwordValidator(data.password);
  }
  private async checkForExistingUser(data: IUserRegister) {
    if (await this.userRepository.findByEmail(data.email)) {
      throw new CustomError("Email already exists", 409);
    }
    if (await this.userRepository.findByUsername(data.username)) {
      throw new CustomError("Username already exists", 409);
    }
  }
  public async register(data: IUserRegister) {
    this.validateRegisterData(data);
    await this.checkForExistingUser(data);
    data.password = await hashPassword(data.password);
    const user = await this.userRepository.createUser(data);

    return await generateAuthTokens(user.id);
  }
  public async login(data: ILogin) {
    validateRequiredFields(data, ["emailOrUsername", "password"]);

    const user = await model.user.findFirst({
      where: {
        OR: [
          { email: data.emailOrUsername },
          { username: data.emailOrUsername },
        ],
      },
    });
    if (!user || !(await verifyPassword(data.password, user.password))) {
      throw new CustomError("Invalid email or password", 401);
    }
    return await generateAuthTokens(user.id);
  }
  public async refreshAccessToken(data: IRefeshToken) {
    const { refreshToken: refreshTokenJWT } = data;
    const decoded = await verifyRefresh(refreshTokenJWT);
    const { refreshToken: refresh, id } = decoded;

    await this.userRepository.findById(id);
    const token = await this.tokenCacheService.getRefreshToken(id);
    if (!(await verifyPassword(refresh, token))) {
      throw new CustomError(invalidToken.message, invalidToken.code);
    }

    return await generateAuthTokens(id);
  }
}
