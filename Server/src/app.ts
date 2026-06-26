import express, { type Request, type Response } from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Health Check API is working fine.",
  });
});

import authRoute from "./routes/auth.route.js";
import taskRoute from "./routes/Task.route.js";

app.use("/api/auth", authRoute);
app.use("/api/", taskRoute);

export default app;
