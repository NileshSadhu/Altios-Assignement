import * as z from "zod";
import { PriorityStatus, TaskStatus } from "../models/task.model.js";

export const taskSchema = z.object({
  title: z.string().trim().min(3).max(100),
  description: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(PriorityStatus).optional(),
});

export const updateTaskSchema = taskSchema.partial();
