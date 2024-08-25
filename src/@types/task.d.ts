import { TaskStatus } from "@prisma/client";

export interface ITaskCreate {
  title: string;
  description?: string;
  dueDate?: Date;
  status?: TaskStatus;
  assignedTo?: string;
}
