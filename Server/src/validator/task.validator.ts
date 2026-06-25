import * as z from "zod";
import { PriorityStatus, TaskStatus } from "../models/task.model.js";

export const task = z.object({
  title: z.string().trim().min(3).max(100),
  description: z.string().trim().min(3).max(500).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(PriorityStatus).optional(),
});
