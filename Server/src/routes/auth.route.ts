import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";

const authRoute = Router();

authRoute.route("/login").post(login);

authRoute.route("/register").post(register);

export default authRoute;
