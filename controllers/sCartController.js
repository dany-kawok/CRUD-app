const ShoppingCart = require("../models/shoppingCartSchema");
const Course = require("../models/Course");

// Add a course to the shopping cart
const addCourseToCart = async (req, res) => {
  const userId = req.user._id;
  const { courseId } = req.body;

  try {
    const newCartItem = new ShoppingCart({ userId, courseId });
    await newCartItem.save();

    res.status(201).json({ status: "success", data: newCartItem });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error
      return res
        .status(400)
        .json({ status: "error", message: "Course already in cart" });
    }
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Remove a course from the shopping cart
const removeCourseFromCart = async (req, res) => {
  const userId = req.user._id;
  const { courseId } = req.body;

  try {
    const cartItem = await ShoppingCart.findOneAndDelete({ userId, courseId });

    if (!cartItem) {
      return res
        .status(404)
        .json({ status: "error", message: "Course not found in cart" });
    }

    res.json({ status: "success", message: "Course removed from cart" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Get the shopping cart for the logged-in user
const getUserCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cartItems = await ShoppingCart.find({ userId })
      .populate("courseId", "title price image")
      .lean();
    console.log(cartItems);
    const formattedCartItems = cartItems.map((item) => ({
      userId: item.userId,
      courseId: item.courseId._id,
      title: item.courseId.title,
      price: item.courseId.price,
      image: item.courseId.image,
    }));

    res.json({ status: "success", data: formattedCartItems });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Delete all items in the shopping cart for the logged-in user
const clearUserCart = async (req, res) => {
  const userId = req.user._id;
  console.log("xxxxxxxxxxxxxxxxxs");
  try {
    await ShoppingCart.deleteMany({ userId });

    res.json({ status: "success", message: "All items removed from cart" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Handle course deletion by clearing associated cart items
const clearCartItemsByCourse = async (courseId) => {
  try {
    await ShoppingCart.deleteMany({ courseId });
  } catch (err) {
    console.error(
      `Error clearing cart items for course ${courseId}: ${err.message}`
    );
  }
};

module.exports = {
  addCourseToCart,
  removeCourseFromCart,
  getUserCart,
  clearUserCart,
  clearCartItemsByCourse,
};
