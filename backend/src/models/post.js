const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      unique: true,
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      trim:true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    like: {
      type: Number,
      default: 0,
    },
    comment: {
      type: Number,
      default: 0,
    },
    media: {
      type:Buffer
    }
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema, "Post");

module.exports = Post;
