const mongoose = require("mongoose");

const shoppingCartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true }
);

// Unique constraint on the combination of userId and courseId
shoppingCartSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model("ShoppingCart", shoppingCartSchema);
