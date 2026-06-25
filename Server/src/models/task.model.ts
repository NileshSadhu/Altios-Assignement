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

export interface ITask {
  _id?: Types.ObjectId;
  title: string;
  description?: string | undefined;
  status: TaskStatus | undefined;
  priority: PriorityStatus | undefined;
  createdAt?: Date;
  updatedAt?: Date;
  userId: Types.ObjectId;
}

const taskSchema = new Schema<ITask>(
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
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Task = mongoose.model<ITask>("Task", taskSchema);
