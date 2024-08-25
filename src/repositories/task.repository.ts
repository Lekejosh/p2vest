import { PrismaClient, Task as ITask, TaskStatus } from "@prisma/client";
import Redis from "../config/database/redis";
import { ITaskCreate } from "../@types/task";
import { IPagination } from "../@types/pagination";

export interface ITaskRepository {
  createTask(data: ITaskCreate, userId: string): Promise<ITask>;
  findById(id: string): Promise<ITask | null>;
  findByStatus(status: TaskStatus): Promise<ITask[]>;
  updateTask(id: string, data: Partial<ITask>): Promise<ITask | null>;
  deleteTask(id: string): Promise<ITask | null>;
  findTasksByUser(
    pagination: IPagination,
    userId: string
  ): Promise<{
    tasks: ITask[];
    pagination: {
      total: number;
      page: number;
      totalPages: number;
    };
  }>;
}

export class TaskRepository implements ITaskRepository {
  private prisma: PrismaClient;
  private redis: typeof Redis;

  constructor() {
    this.prisma = new PrismaClient();
    this.redis = Redis;
  }

  private async cacheTask(id: string, task: ITask): Promise<void> {
    await this.redis.set(`task:${id}`, JSON.stringify(task), "EX", 600);
  }

  private async getCachedTask(id: string): Promise<ITask | null> {
    const cachedTask = await this.redis.get(`task:${id}`);
    return cachedTask ? JSON.parse(cachedTask) : null;
  }

  public async createTask(data: ITaskCreate, userId: string): Promise<ITask> {
    const task = await this.prisma.task.create({
      data: {
        title: data.title,
        dueDate: data.dueDate,
        status: data.status,
        description: data.description,
        assignedTo: data.assignedTo,
        createdBy: userId,
      },
    });
    await this.cacheTask(task.id, task);
    return task;
  }

  public async findById(id: string): Promise<ITask | null> {
    const cachedTask = await this.getCachedTask(id);
    if (cachedTask) return cachedTask;

    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        createdByUser: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
        assignedToUser: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
    });
    if (task) {
      await this.cacheTask(id, task);
      return task;
    }
    return null;
  }

  public async findByStatus(status: TaskStatus): Promise<ITask[]> {
    const cachedTasks = await this.redis.get(`tasks:status:${status}`);
    if (cachedTasks) return JSON.parse(cachedTasks);

    const tasks = await this.prisma.task.findMany({
      where: { status },
    });
    if (tasks.length > 0) {
      await this.redis.set(
        `tasks:status:${status}`,
        JSON.stringify(tasks),
        "EX",
        3600
      );
    }
    return tasks;
  }

  public async updateTask(
    id: string,
    data: Partial<ITask>
  ): Promise<ITask | null> {
    const updatedTask = await this.prisma.task.update({
      where: { id },
      data,
    });
    if (updatedTask) {
      await this.cacheTask(id, updatedTask);
      return updatedTask;
    }
    return null;
  }

  public async deleteTask(id: string): Promise<ITask | null> {
    const deletedTask = await this.prisma.task.delete({
      where: { id },
    });
    if (deletedTask) {
      await this.redis.del(`task:${id}`);
      return deletedTask;
    }
    return null;
  }
  public async findTasksByUser(
    pagination: IPagination,
    userId: string
  ): Promise<{
    tasks: ITask[];
    pagination: {
      total: number;
      page: number;
      totalPages: number;
    };
  }> {
    const { dueDate, status, limit = 5 } = pagination;
    let { page = 1 } = pagination;
    const num = Number(page);
    if (Number.isNaN(num) || num <= 0) {
      page = 1;
    }
    const offset = (page - 1) * limit;

    const cacheKey = `tasks:user:${userId}:page:${page}:limit:${limit}:${status}:${dueDate}`;
    let query = {};
    if (status) {
      if (Object.values(TaskStatus).includes(status)) {
        query = { ...query, status: status };
      }
    }
    if (dueDate) {
      const date = new Date(dueDate);
      if (date instanceof Date) {
        query = { ...query, dueDate: date };
      }
    }
    // Check if the tasks are cached
    const cachedTasks = await this.redis.get(cacheKey);
    // if (cachedTasks) {
    //   return JSON.parse(cachedTasks);
    // }
    query = {
      OR: [{ createdBy: userId }, { assignedTo: userId }],
      ...query,
    };
    const tasks = await this.prisma.task.findMany({
      where: query,
      include: {
        assignedToUser: {
          select: {
            id: true,
            username: true,
          },
        },
        createdByUser: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: [{ createdAt: "desc" }],
      skip: offset,
      take: Number(limit),
    });

    if (tasks.length > 0) {
      await this.redis.set(cacheKey, JSON.stringify(tasks), "EX", 600);
    }
    const total = await this.prisma.task.count({ where: { ...query } });
    const totalPages = Math.ceil(total / limit);
    return {
      tasks,
      pagination: {
        total,
        page,
        totalPages,
      },
    };
  }
}
