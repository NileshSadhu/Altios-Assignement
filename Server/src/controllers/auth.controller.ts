import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validator/auth.validator.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET! as string,
      {
        expiresIn: "1h",
      },
    );

    return res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    console.log("User login failed : ", error);
    return res.status(500).json({
      message: "Server side error.",
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = registerSchema.parse(req.body);

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser?.email === email) {
      return res.status(409).json({ message: "User already exists." });
    }

    if (existingUser?.username === username) {
      return res.status(409).json({ message: "Username already taken." });
    }

    const hashPwd = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashPwd,
    });

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET! as string,
      {
        expiresIn: "1h",
      },
    );

    return res.status(201).json({
      message: "User registered successfully",
      token: token,
    });
  } catch (error) {
    console.log("User register failed : ", error);
    return res.status(500).json({
      message: "Server side error.",
    });
  }
};
