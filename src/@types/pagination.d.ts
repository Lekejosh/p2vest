import { TaskStatus } from "@prisma/client";

export interface IPagination {
  limit?: number;
  page?: number;
  dueDate?:Date;
  status?: TaskStatus
}
