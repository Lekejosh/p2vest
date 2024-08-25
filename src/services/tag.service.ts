import { Tag as ITag } from "@prisma/client";
import { TagRepository } from "../repositories/tag.repository";

export class TagService {
  private tagRepository = new TagRepository();

  public async createTag(data: Omit<ITag, "id">): Promise<ITag> {
    return this.tagRepository.createTag(data);
  }

  public async getTagById(id: string): Promise<ITag | null> {
    return this.tagRepository.findById(id);
  }

  public async getTagByName(name: string): Promise<ITag | null> {
    return this.tagRepository.findByName(name);
  }

  public async getAllTags(): Promise<ITag[]> {
    return this.tagRepository.findAll();
  }

  public async updateTag(
    id: string,
    data: Partial<Omit<ITag, "id">>,
  ): Promise<ITag | null> {
    return this.tagRepository.updateTag(id, data);
  }

  public async deleteTag(id: string): Promise<ITag | null> {
    return this.tagRepository.deleteTag(id);
  }

  public async ensureDefaultTags(): Promise<void> {
    await this.tagRepository.ensureDefaultTags();
  }
}
