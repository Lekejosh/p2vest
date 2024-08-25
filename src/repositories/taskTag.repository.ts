import {
  PrismaClient,
  TaskTag as ITaskTag,
  Tag as ITag,
  Task as ITask,
} from "@prisma/client";

export interface ITaskTagRepository {
  addTagToTask(taskId: string, tagId: string): Promise<ITaskTag>;
  removeTagFromTask(taskId: string, tagId: string): Promise<ITaskTag | null>;
  getATask(taskId: string, tagId: string): Promise<ITaskTag | null>;
  getTagsForTask(taskId: string): Promise<ITag[]>;
  getTasksForTag(tagId: string): Promise<ITask[]>;
  removeAllTagsFromTask(taskId: string): Promise<void>;
}

export class TaskTagRepository implements ITaskTagRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async addTagToTask(taskId: string, tagId: string): Promise<ITaskTag> {
    return this.prisma.taskTag.create({
      data: {
        taskId,
        tagId,
      },
    });
  }
  public async getATask(
    taskId: string,
    tagId: string,
  ): Promise<ITaskTag | null> {
    return this.prisma.taskTag.findFirst({
      where: {
        taskId,
        tagId,
      },
    });
  }
  public async removeTagFromTask(
    taskId: string,
    tagId: string,
  ): Promise<ITaskTag | null> {
    return this.prisma.taskTag.delete({
      where: {
        taskId_tagId: {
          taskId,
          tagId,
        },
      },
    });
  }

  public async getTagsForTask(taskId: string): Promise<ITag[]> {
    const taskTags = await this.prisma.taskTag.findMany({
      where: { taskId },
      include: {
        tag: true,
      },
    });
    return taskTags.map((taskTag) => taskTag.tag);
  }

  public async getTasksForTag(tagId: string): Promise<ITask[]> {
    const taskTags = await this.prisma.taskTag.findMany({
      where: { tagId },
      include: {
        task: true,
      },
    });
    return taskTags.map((taskTag) => taskTag.task);
  }

  public async removeAllTagsFromTask(taskId: string): Promise<void> {
    await this.prisma.taskTag.deleteMany({
      where: { taskId },
    });
  }
}
