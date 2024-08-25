import { PrismaClient, Tag as ITag } from "@prisma/client";
import Redis from "../config/database/redis";

export interface ITagRepository {
  createTag(data: Omit<ITag, "id">): Promise<ITag>;
  findById(id: string): Promise<ITag | null>;
  findByName(name: string): Promise<ITag | null>;
  findAll(): Promise<ITag[]>;
  updateTag(id: string, data: Partial<Omit<ITag, "id">>): Promise<ITag | null>;
  deleteTag(id: string): Promise<ITag | null>;
  ensureDefaultTags(): Promise<void>;
}

export class TagRepository implements ITagRepository {
  private prisma: PrismaClient;
  private redis: typeof Redis;

  constructor() {
    this.prisma = new PrismaClient();
    this.redis = Redis;
  }

  private async cacheTag(id: string, tag: ITag): Promise<void> {
    await this.redis.set(`tag:${id}`, JSON.stringify(tag), "EX", 600);
  }

  private async getCachedTag(id: string): Promise<ITag | null> {
    const cachedTag = await this.redis.get(`tag:${id}`);
    return cachedTag ? JSON.parse(cachedTag) : null;
  }

  public async createTag(data: Omit<ITag, "id">): Promise<ITag> {
    const tag = await this.prisma.tag.create({
      data: {
        ...data,
      },
    });
    await this.cacheTag(tag.id, tag);
    return tag;
  }

  public async findById(id: string): Promise<ITag | null> {
    const cachedTag = await this.getCachedTag(id);
    if (cachedTag) return cachedTag;

    const tag = await this.prisma.tag.findUnique({
      where: { id },
    });
    if (tag) {
      await this.cacheTag(id, tag);
      return tag;
    }
    return null;
  }

  public async findByName(name: string): Promise<ITag | null> {
    const cachedTag = await this.redis.get(`tag:name:${name}`);
    if (cachedTag) return JSON.parse(cachedTag);

    const tag = await this.prisma.tag.findUnique({
      where: { name },
    });
    if (tag) {
      await this.redis.set(`tag:name:${name}`, JSON.stringify(tag), "EX", 3600);
      return tag;
    }
    return null;
  }

  public async findAll(): Promise<ITag[]> {
    const cachedTags = await this.redis.get(`tags:all`);
    if (cachedTags) return JSON.parse(cachedTags);

    const tags = await this.prisma.tag.findMany();
    if (tags.length > 0) {
      await this.redis.set(`tags:all`, JSON.stringify(tags), "EX", 3600);
    }
    return tags;
  }

  public async updateTag(
    id: string,
    data: Partial<Omit<ITag, "id">>,
  ): Promise<ITag | null> {
    const updatedTag = await this.prisma.tag.update({
      where: { id },
      data,
    });
    if (updatedTag) {
      await this.cacheTag(id, updatedTag);
      return updatedTag;
    }
    return null;
  }

  public async deleteTag(id: string): Promise<ITag | null> {
    const deletedTag = await this.prisma.tag.delete({
      where: { id },
    });
    if (deletedTag) {
      await this.redis.del(`tag:${id}`);
      return deletedTag;
    }
    return null;
  }

  public async ensureDefaultTags(): Promise<void> {
    const defaultTags = ["urgent", "bug", "feature"];
    for (const tagName of defaultTags) {
      const tagExists = await this.findByName(tagName);
      if (!tagExists) {
        await this.createTag({ name: tagName });
      }
    }
  }
}
