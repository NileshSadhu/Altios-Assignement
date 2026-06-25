import mongoose, { Schema, Types } from "mongoose";

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
}

export enum PriorityStatus {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export interface Task {
  _id?: Types.ObjectId;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: PriorityStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const taskSchema = new Schema<Task>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.PENDING,
    },
    priority: {
      type: String,
      enum: Object.values(PriorityStatus),
      default: PriorityStatus.MEDIUM,
    },
  },
  {
    timestamps: true,
  },
);

export const Task = mongoose.model<Task>("Task", taskSchema);
