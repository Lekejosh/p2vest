import { Role } from "@prisma/client";
import { IUserRegister, IUserRegisterAdmin } from "../@types/user";
import { UserRepository } from "../repositories/user.repository";
import CustomError from "../utils/custom-error";
import { hashPassword } from "../utils/passwordHashing";
import {
  passwordValidator,
  validateEmail,
  validateRequiredFields,
  validateUsername,
} from "../utils/validation-utils";

export class UserService {
  private userRepository = new UserRepository();
  private validateRegisterData(data: IUserRegisterAdmin) {
    validateRequiredFields(data, ["email", "username", "password", "role"]);
    validateEmail(data.email);
    validateUsername(data.username);
    passwordValidator(data.password);
    if (data.role && !Object.values(Role).includes(data.role)) {
      throw new CustomError("Role is not a valid type", 422);
    }
  }
  private async checkForExistingUser(data: IUserRegisterAdmin) {
    if (await this.userRepository.findByEmail(data.email)) {
      throw new CustomError("Email already exists", 409);
    }
    if (await this.userRepository.findByUsername(data.username)) {
      throw new CustomError("Username already exists", 409);
    }
  }
  public async createUser(data: IUserRegisterAdmin) {
    this.validateRegisterData(data);
    await this.checkForExistingUser(data);
    data.password = await hashPassword(data.password);
    const user = await this.userRepository.createUser(data);
    return;
  }
  public async getUsers() {
    return await this.userRepository.getUsers();
  }
}
