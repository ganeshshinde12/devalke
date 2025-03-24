import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/User";
import { body, validationResult } from "express-validator";

const router = express.Router();

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

// User login route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req: LoginRequest, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user || !user.password) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      res.json({ token });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Login error:", error.message);
      } else {
        console.error("Login error:", error);
      }
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
