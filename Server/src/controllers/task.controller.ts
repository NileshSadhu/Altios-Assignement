import type { Request, Response } from "express";
import { taskSchema } from "../validator/task.validator.js";
import { Task } from "../models/task.model.js";
import { ZodError } from "zod";

export const getTask = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    const filter: Record<string, unknown> = {
      userId: req.userId,
    };

    if (status) {
      filter.status = status;
    }

    const tasks = await Task.find(filter);

    return res.status(200).json({
      tasks,
    });
  } catch (error) {
    console.log("Failed to send task : ", error);
    return res.status(500).json({
      message: "Server side error.",
    });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Task id is required",
      });
    }

    const task = await Task.findOne({
      _id: id,
      userId: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      task,
    });
  } catch (error) {
    console.log("Failed to send particular task : ", error);
    return res.status(500).json({
      message: "Server side error.",
    });
  }
};

export const addTask = async (req: Request, res: Response) => {
  try {
    const task = taskSchema.parse(req.body);

    const taskCreated = await Task.create({
      ...task,
      userId: req.userId,
    });

    return res.status(201).json({
      message: "Task created successfully.",
      task: taskCreated,
    });
  } catch (error) {
    console.log("Failed to add task : ", error);

    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Zod validation Error.",
      });
    }

    return res.status(500).json({
      message: "Server side error.",
    });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const task = taskSchema.parse(req.body);
    const { id } = req.params;

    const updatedTask = await Task.findOneAndUpdate(
      {
        id: id,
        userId: req.userId,
      },
      task,
      {
        new: true,
      },
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task updated successfully.",
      task: updatedTask,
    });
  } catch (error) {
    console.log("Failed to update task : ", error);

    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Zod validation Error.",
      });
    }

    return res.status(500).json({
      message: "Server side error.",
    });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Task id is required",
      });
    }

    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      userId: req.userId,
    });

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully.",
    });
  } catch (error) {
    console.log("Failed to delete task : ", error);

    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Zod validation Error.",
      });
    }

    return res.status(500).json({
      message: "Server side error.",
    });
  }
};
