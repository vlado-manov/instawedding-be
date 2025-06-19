const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: String,
  user: String,
  date: { type: Date, default: Date.now },
});

const imageSchema = new mongoose.Schema({
  uploader: String,
  imageUrls: [String],
  originalUrls: [String],
  comments: [commentSchema],
  likes: { type: Number, default: 0 },
  likedBy: [String],
  createdAt: { type: Date, default: Date.now },
  hidden: { type: Boolean, default: false },
  isPortrait: { type: Boolean, default: false },
});

module.exports = mongoose.model("Image", imageSchema);
