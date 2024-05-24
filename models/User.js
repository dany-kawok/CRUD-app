const mongoose = require("mongoose");
const userRoles = require("../utils/userRoles");

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Unique email constraint
    password: { type: String, required: true },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }], // Unique courses constraint
    role: {
      type: String,
      enum: [userRoles.ADMIN, userRoles.USER, userRoles.MODERATOR],
      default: userRoles.USER,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
