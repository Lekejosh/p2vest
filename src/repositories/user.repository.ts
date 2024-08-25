import { PrismaClient, User as IUser } from "@prisma/client";
import Redis from "../config/database/redis";
import { IUserRegister, IUserRegisterAdmin } from "../@types/user";

export interface IUserRepository {
  createUser(data: IUserRegister): Promise<Omit<IUser, "password">>;
  createUserAdmin(data: IUserRegisterAdmin): Promise<Omit<IUser, "password">>;
  findById(id: string): Promise<Omit<IUser, "password"> | null>;
  findByEmail(email: string): Promise<Omit<IUser, "password"> | null>;
  getUsers(): Promise<Omit<IUser, "password">[]>;
  findByUsername(username: string): Promise<Omit<IUser, "password"> | null>;

  updateUser(
    id: string,
    data: Partial<Omit<IUser, "id" | "createdAt" | "updatedAt">>
  ): Promise<Omit<IUser, "password"> | null>;
  deleteUser(id: string): Promise<Omit<IUser, "password"> | null>;
}

export class UserRepository implements IUserRepository {
  private prisma: PrismaClient;
  private redis: typeof Redis;

  constructor() {
    this.prisma = new PrismaClient();
    this.redis = Redis;
  }

  private excludePassword(user: IUser): Omit<IUser, "password"> {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private async cacheUser(
    id: string,
    user: Omit<IUser, "password">
  ): Promise<void> {
    await this.redis.set(id, JSON.stringify(user), "EX", 3000);
  }

  private async getCachedUser(
    id: string
  ): Promise<Omit<IUser, "password"> | null> {
    const cachedUser = await this.redis.get(id);
    return cachedUser ? JSON.parse(cachedUser) : null;
  }

  public async createUser(
    data: IUserRegister
  ): Promise<Omit<IUser, "password">> {
    const user = await this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: data.password,
      },
    });
    const userWithoutPassword = this.excludePassword(user);
    await this.cacheUser(user.id, userWithoutPassword);
    return userWithoutPassword;
  }
  public async createUserAdmin(
    data: IUserRegisterAdmin
  ): Promise<Omit<IUser, "password">> {
    const user = await this.prisma.user.create({
      data: {
        ...data,
      },
    });
    const userWithoutPassword = this.excludePassword(user);
    await this.cacheUser(user.id, userWithoutPassword);
    return userWithoutPassword;
  }

  public async findById(id: string): Promise<Omit<IUser, "password"> | null> {
    const cachedUser = await this.getCachedUser(id);
    if (cachedUser) return cachedUser;

    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (user) {
      const userWithoutPassword = this.excludePassword(user);
      await this.cacheUser(id, userWithoutPassword);
      return userWithoutPassword;
    }
    return null;
  }

  public async findByEmail(
    email: string
  ): Promise<Omit<IUser, "password"> | null> {
    const cachedUser = await this.redis.get(`email:${email}`);
    if (cachedUser) return JSON.parse(cachedUser);

    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      const userWithoutPassword = this.excludePassword(user);
      await this.redis.set(
        `email:${email}`,
        JSON.stringify(userWithoutPassword),
        "EX",
        3600
      );
      return userWithoutPassword;
    }
    return null;
  }

  public async findByUsername(
    username: string
  ): Promise<Omit<IUser, "password"> | null> {
    const cachedUser = await this.redis.get(`username:${username}`);
    if (cachedUser) return JSON.parse(cachedUser);

    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    if (user) {
      const userWithoutPassword = this.excludePassword(user);
      await this.redis.set(
        `username:${username}`,
        JSON.stringify(userWithoutPassword),
        "EX",
        3600
      );
      return userWithoutPassword;
    }
    return null;
  }
  public async updateUser(
    id: string,
    data: Partial<Omit<IUser, "id" | "createdAt" | "updatedAt">>
  ): Promise<Omit<IUser, "password"> | null> {
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data,
    });
    if (updatedUser) {
      const userWithoutPassword = this.excludePassword(updatedUser);
      await this.cacheUser(id, userWithoutPassword);
      return userWithoutPassword;
    }
    return null;
  }
  public async getUsers(): Promise<Omit<IUser, "password">[]> {
    const users = await this.prisma.user.findMany({});
    const usersWithoutPassword = users.map((user) =>
      this.excludePassword(user)
    );
    return usersWithoutPassword;
  }

  public async deleteUser(id: string): Promise<Omit<IUser, "password"> | null> {
    const deletedUser = await this.prisma.user.delete({
      where: { id },
    });
    if (deletedUser) {
      await this.redis.del(id);
      return this.excludePassword(deletedUser);
    }
    return null;
  }
}
