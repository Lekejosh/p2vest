import { TagRepository } from "../repositories/tag.repository";
import { TaskRepository } from "../repositories/task.repository";
import { TaskTagRepository } from "../repositories/taskTag.repository";
import CustomError from "../utils/custom-error";
import { validateRequiredFields } from "../utils/validation-utils";
import { NotificationService } from "./notification.service";
import { TagService } from "./tag.service";

export class TaskTagService {
  private taskRepository = new TaskRepository();
  private taskTagRepository = new TaskTagRepository();
  private tagService = new TagService();
  private notificationService = new NotificationService();
  public async addTagToTask(
    taskId: string,
    data: { name: string },
    userId: string,
  ) {
    validateRequiredFields(data, ["name"]);
    let tag = await this.tagService.getTagByName(data.name);
    if (!tag) tag = await this.tagService.createTag({ name: data.name });
    const task = await this.taskRepository.findById(taskId);
    if (!task || task.createdBy !== userId || task.assignedTo !== userId) {
      throw new CustomError("Task not found", 404);
    }
    const exist = await this.taskTagRepository.getATask(taskId, tag.id);
    if (exist) {
      throw new CustomError("Tag already assigned to task", 400);
    }
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
        `A new Tag has been added to the task: ${task.title}`,
      );
    }
    await this.taskTagRepository.addTagToTask(taskId, tag.id);
  }
  public async removeTagFromTask(
    taskId: string,
    data: { name: string },
    userId: string,
  ) {
    validateRequiredFields(data, ["name"]);
    const tag = await this.tagService.getTagByName(data.name);
    if (!tag) {
      throw new CustomError(`Tag with name ${data.name} does not exist.`, 404);
    }
    const task = await this.taskRepository.findById(taskId);
    if (!task || task.createdBy !== userId || task.assignedTo !== userId) {
      throw new CustomError("Task not found", 404);
    }
    await this.taskTagRepository.removeTagFromTask(taskId, tag.id);
  }
  public async getTagsForTask(taskId: string) {
    const tags = await this.taskTagRepository.getTagsForTask(taskId);
    return tags.map((tag) => tag.name);
  }
  public async removeAllTagsFromTask(taskId: string, userId: string) {
    const task = await this.taskRepository.findById(taskId);
    if (!task || task.createdBy !== userId || task.assignedTo !== userId) {
      throw new CustomError("Task not found", 404);
    }
    await this.taskTagRepository.removeAllTagsFromTask(taskId);
  }
  public async ensureDefaultTags(
    taskId: string,
    userId: string,
  ): Promise<void> {
    const defaultTags = ["urgent", "bug", "feature"];
    for (const tagName of defaultTags) {
      await this.addTagToTask(taskId, { name: tagName }, userId);
    }
  }
}
