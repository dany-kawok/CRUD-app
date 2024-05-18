const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    image: { type: String }, // URL or path to the image
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
