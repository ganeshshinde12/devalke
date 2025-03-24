import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Repo from "../models/Repository"; // Assuming Repo model exists

const router = express.Router();

// Define an Authenticated Request type
interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

// Middleware to verify token
const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access denied" });
    return;
  }

  try {
    const decoded = jwt.verify(token, "your_secret_key") as { id: string; email: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

router.get("/repos", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return; // Ensure function execution stops
    }

    const repos = await Repo.find({ ownerId: req.user.id });
    res.status(200).json(repos);
  } catch (error) {
    console.error("Error fetching repositories:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


export default router;
