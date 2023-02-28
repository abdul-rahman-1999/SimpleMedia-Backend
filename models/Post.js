const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      max: 500,
      min:5
    },
    img: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
