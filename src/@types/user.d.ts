import { Role, User } from "@prisma/client";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      $user?: Omit<User, "password">;
    }
  }
}

export interface IUserRegister {
  email: string;
  username: string;
  password: string;
}

export interface IUserRegisterAdmin {
  email: string;
  username: string;
  password: string;
  role:Role
}

export interface IUserUpdateEmail {
  email: string;
}

export interface IUserUpdatePassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ILogin {
  emailOrUsername: string;
  password: string;
}

export interface IEmail {
  email: string;
}

export interface IResetPassword {
  userId: string;
  token: string;
  password: string;
  confirmPassword: string;
}
