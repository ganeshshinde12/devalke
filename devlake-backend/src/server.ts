import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import repoRoutes from "./routes/repoRoutes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI!);

app.use("/api/auth", authRoutes);
app.use("/api/repos", repoRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
