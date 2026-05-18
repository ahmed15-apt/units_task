const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo connection error:", err));

const PostSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model("Post", PostSchema);

app.get("/posts", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

app.post("/posts", async (req, res) => {
  const post = await Post.create(req.body);
  res.json(post);
});

app.put("/posts/:id", async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(post);
});

app.delete("/posts/:id", async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Post deleted" });
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
