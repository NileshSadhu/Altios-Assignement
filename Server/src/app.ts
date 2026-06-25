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

export default app;
