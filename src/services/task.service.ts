import { TaskStatus, User } from "@prisma/client";
import { ITaskCreate } from "../@types/task";
import { TaskRepository } from "../repositories/task.repository";
import { UserRepository } from "../repositories/user.repository";
import { validateRequiredFields } from "../utils/validation-utils";
import CustomError from "../utils/custom-error";
import { IPagination } from "../@types/pagination";
import { TaskTagService } from "./taskTag.service";
import { NotificationService } from "./notification.service";

export class TaskService {
  private taskRepository = new TaskRepository();
  private userRepository = new UserRepository();
  private taskTagService = new TaskTagService();
  private notificationService = new NotificationService();
  public async create(data: ITaskCreate, userId: string) {
    validateRequiredFields(data, ["title"]);
    if (data.status && !Object.values(TaskStatus).includes(data.status)) {
      throw new CustomError("Status is not a valid type", 422);
    }
    if (data.dueDate) {
      data.dueDate = new Date(data.dueDate);
      if (!(data.dueDate instanceof Date)) {
        throw new CustomError("Date is not a valid type", 422);
      }
    }
    if (data.assignedTo) {
      const user = await this.userRepository.findById(data.assignedTo);
      if (!user) {
        throw new CustomError("Assigned user does not exist", 422);
      }
    }
    const task = await this.taskRepository.createTask(data, userId);
    let recipientUserId: string | null = null;
    if (task.createdBy && task.createdBy !== userId) {
      recipientUserId = task.createdBy;
    } else if (task.assignedTo && task.assignedTo !== userId) {
      recipientUserId = task.assignedTo;
    }
    if (recipientUserId) {
      await this.notificationService.create(
        recipientUserId,
        task.id,
        `A new Task has been assigned to you: ${task.title}`
      );
    }
    await this.taskTagService.ensureDefaultTags(task.id, userId);
    return task;
  }

  public async getTask(id: string) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new CustomError("Task not found", 404);
    }
    return task;
  }

  public async updateTask(
    id: string,
    data: Partial<ITaskCreate>,
    user: Omit<User, "password">
  ) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new CustomError("Task not found", 404);
    }
    if (
      task.assignedTo !== user.id &&
      task.createdBy !== user.id &&
      user.role !== "ADMIN"
    ) {
      throw new CustomError("Task not found", 404);
    }
    if (data.status!==undefined && !Object.values(TaskStatus).includes(data.status)) {
      throw new CustomError("Status is not a valid type", 422);
    }
    if (data.dueDate) {
      data.dueDate = new Date(data.dueDate);
      if (!(data.dueDate instanceof Date)) {
        throw new CustomError("Date is not a valid type", 422);
      }
    }
    data.assignedTo = undefined;

    return await this.taskRepository.updateTask(id, data);
  }

  public async deleteTask(id: string) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new CustomError("Task not found", 404);
    }
    return await this.taskRepository.deleteTask(id);
  }

  public async getTasksByStatus(status: TaskStatus) {
    if (!Object.values(TaskStatus).includes(status)) {
      throw new CustomError("Status is not a valid type", 422);
    }
    await this.taskRepository.findByStatus(status);
    return;
  }

  public async assignTask(id: string, data: { userId: string }) {
    validateRequiredFields(data, ["userId"]);
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new CustomError("Task not found", 404);
    }
    const user = await this.userRepository.findById(data.userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    await this.notificationService.create(
      data.userId,
      task.id,
      `You have been assigned from the task: ${task.title}`
    );

    return await this.taskRepository.updateTask(id, {
      assignedTo: data.userId,
    });
  }
  public async unAssignTask(id: string, userId: string) {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new CustomError("Task not found", 404);
    }
    await this.taskRepository.updateTask(id, {
      assignedTo: null,
    });
    if (task.assignedTo && task.assignedTo !== userId) {
      await this.notificationService.create(
        task.assignedTo,
        task.id,
        `You have been unassigned from the task: ${task.title}`
      );
    }
    return;
  }
  public async getTasksByUser(userId: string, query: IPagination) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    return await this.taskRepository.findTasksByUser(query, userId);
  }
}
