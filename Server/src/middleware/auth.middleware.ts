import type { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import jwt, { type JwtPayload } from "jsonwebtoken";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

declare global {
  namespace Express {
    interface Request {
      _id: string;
    }
  }
}

const checkApi = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization header missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1] as string;
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req._id = decoded.id as string;

    next();
  } catch (error) {
    console.log("Failed to check user : ", error);
    return res.status(500).json({
      message: "Server Side error.",
    });
  }
};
