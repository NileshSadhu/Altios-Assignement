import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const checkUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      console.log("JWT_SECRET is not set in environment variables.");
      return res.status(500).json({
        message: "Server side error.",
      });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization header missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1] as string;
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded.id) {
      return res.status(401).json({
        message: "Invalid token payload.",
      });
    }

    req.userId = decoded.id as string;

    next();
  } catch (error) {
    console.log("Failed to check user : ", error);
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};

export default checkUser;
