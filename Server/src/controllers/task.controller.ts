import type { Request, Response } from "express";

const getTask = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.log("Failed to send task : ", error);
    return res.status(500).json({
      message: "Server side error.",
    });
  }
};

const getTaskById = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.log("Failed to send particular task : ", error);
    return res.status(500).json({
      message: "Server side error.",
    });
  }
};

const addTask = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.log("Failed to add task : ", error);
    return res.status(500).json({
      message: "Server side error.",
    });
  }
};

const updateTask = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.log("Failed to update task : ", error);
    return res.status(500).json({
      message: "Server side error.",
    });
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
  } catch (error) {
    console.log("Failed to delete task : ", error);
    return res.status(500).json({
      message: "Server side error.",
    });
  }
};
