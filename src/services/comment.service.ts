import { CommentsRepository } from "../repositories/comment.repository";
import { TaskRepository } from "../repositories/task.repository";
import CustomError from "../utils/custom-error";
import { validateRequiredFields } from "../utils/validation-utils";
import { NotificationService } from "./notification.service";

export class CommentService {
  private commentRepository = new CommentsRepository();
  private taskRepository = new TaskRepository();
  private notificationService = new NotificationService();
  public async create(
    taskId: string,
    data: { content: string },
    userId: string,
  ) {
    validateRequiredFields(data, ["content"]);
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new CustomError("Task not found", 404);
    }
    await this.commentRepository.create({
      taskId,
      userId,
      content: data.content,
    });
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
        `A new comment has been added to the task: ${task.title}`,
      );
    }
    return;
  }
  public async getComments(taskId: string) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new CustomError("Task not found", 404);
    }
    return await this.commentRepository.findByTaskId(taskId);
  }
  public async getComment(id: string) {
    const comment = await this.commentRepository.findById(id);
    if (!comment) {
      throw new CustomError("Comment not found", 404);
    }
    return comment;
  }
  public async edit(
    commentId: string,
    userId: string,
    data: { content: string },
  ) {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new CustomError("Comment not found", 404);
    }
    if (!data.content) return;
    await this.commentRepository.update(commentId, userId, data.content);
    return;
  }
  public async delete(commentId: string, userId: string) {
    const comment = await this.commentRepository.findById(commentId);
    if (!comment) {
      throw new CustomError("Comment not found", 404);
    }
    await this.commentRepository.delete(commentId, userId);
  }
}
