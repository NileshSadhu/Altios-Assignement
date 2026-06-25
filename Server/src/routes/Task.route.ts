import { Router } from "express";
import {
  addTask,
  deleteTask,
  getTask,
  getTaskById,
  updateTask,
} from "../controllers/task.controller.js";
import checkUser from "../middleware/auth.middleware.js";

const taskRoute = Router();

taskRoute.use(checkUser);

taskRoute.route("/tasks").get(getTask).post(addTask);

taskRoute
  .route("/tasks/:id")
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

export default taskRoute;
