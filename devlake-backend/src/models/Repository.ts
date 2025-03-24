import mongoose from "mongoose";

const RepoSchema = new mongoose.Schema({
  name: String,
  url: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("Repository", RepoSchema);
