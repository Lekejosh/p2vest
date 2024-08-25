import { PrismaClient, Comment } from "@prisma/client";
import Redis from "../config/database/redis";
import { UserRepository } from "./user.repository";

export interface ICommentsRepository {
  create(commentData: {
    taskId: string;
    userId: string;
    content: string;
  }): Promise<Comment>;

  update(
    commentId: string,
    userId: string,
    content: string,
  ): Promise<Comment | null>;

  delete(commentId: string, userId: string): Promise<void>;

  findById(commentId: string): Promise<Comment | null>;

  findByTaskId(taskId: string): Promise<Comment[]>;
}

export class CommentsRepository implements ICommentsRepository {
  private prisma: PrismaClient;
  private redis: typeof Redis;
  private userRepository = new UserRepository()

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
    this.redis = Redis;
  }

  private async cacheComment(id: string, comment: Comment): Promise<void> {
    await this.redis.set(`comment:${id}`, JSON.stringify(comment), "EX", 600);
  }

  private async getCachedComment(id: string): Promise<Comment | null> {
    const cachedComment = await this.redis.get(`comment:${id}`);
    return cachedComment ? JSON.parse(cachedComment) : null;
  }

  private async cacheCommentsByTask(
    taskId: string,
    comments: Comment[],
  ): Promise<void> {
    await this.redis.set(
      `comments:task:${taskId}`,
      JSON.stringify(comments),
      "EX",
      600,
    );
  }

  private async getCachedCommentsByTask(
    taskId: string,
  ): Promise<Comment[] | null> {
    const cachedComments = await this.redis.get(`comments:task:${taskId}`);
    return cachedComments ? JSON.parse(cachedComments) : null;
  }

  public async create(commentData: {
    taskId: string;
    userId: string;
    content: string;
  }): Promise<Comment> {
    const comment = await this.prisma.comment.create({
      data: {
        taskId: commentData.taskId,
        userId: commentData.userId,
        content: commentData.content,
      },
    });

    await this.redis.del(`comments:task:${commentData.taskId}`);

    await this.cacheComment(comment.id, comment);
    return comment;
  }

  public async update(
    commentId: string,
    userId: string,
    content: string,
  ): Promise<Comment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.userId !== userId) {
      return null;
    }

    const updatedComment = await this.prisma.comment.update({
      where: { id: commentId },
      data: { content, edited: true },
    });

    await this.redis.del(`comment:${commentId}`);
    await this.redis.del(`comments:task:${comment.taskId}`);

    await this.cacheComment(updatedComment.id, updatedComment);
    return updatedComment;
  }

  public async delete(commentId: string, userId: string): Promise<void> {
    const admin = await this.userRepository.findById(userId)
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || (comment.userId !== userId && admin!.role!=="ADMIN")) {
      throw new Error("User is not allowed to delete this comment");
    }

    await this.prisma.comment.delete({
      where: { id: commentId },
    });

    await this.redis.del(`comment:${commentId}`);
    await this.redis.del(`comments:task:${comment.taskId}`);
  }

  public async findById(commentId: string): Promise<Comment | null> {
    const cachedComment = await this.getCachedComment(commentId);
    if (cachedComment) return cachedComment;

    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (comment) {
      await this.cacheComment(commentId, comment);
    }

    return comment;
  }

  public async findByTaskId(taskId: string): Promise<Comment[]> {
    const cachedComments = await this.getCachedCommentsByTask(taskId);
    if (cachedComments) return cachedComments;

    const comments = await this.prisma.comment.findMany({
      where: { taskId },
    });

    if (comments.length > 0) {
      await this.cacheCommentsByTask(taskId, comments);
    }

    return comments;
  }
}
