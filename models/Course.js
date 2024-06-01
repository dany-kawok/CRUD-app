const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tutors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tutor" }],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: { type: String },
    price: { type: Number, required: true },
    rating: { type: Number },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Course", courseSchema);
