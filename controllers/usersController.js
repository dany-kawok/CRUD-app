const User = require("../models/User");
const Course = require("../models/Course");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();
    if (!users.length) {
      return res.json({
        status: "success",
        data: [],
        message: "No users found",
      });
    }
    return res.json({ status: "success", data: users });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId).lean();
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    return res.json({
      status: "success",
      message: "User deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

// Modify user
const modifyUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { first_name, last_name, role } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { first_name, last_name, role },
      { new: true }
    ).lean();
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }
    return res.json({ status: "success", data: user });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};
// Get all courses for a specific user
const getUserCourses = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).populate("courses").lean();
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", data: { message: "User not found" } });
    }
    return res.json({ status: "success", data: user.courses });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "error", data: { message: err.message } });
  }
};

// Add a course to a specific user
const addCourseToUser = async (req, res) => {
  const userId = req.params.userId;
  const { courseId } = req.body;
  // console.log(courseId);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", data: { message: "User not found" } });
    }

    const course = await Course.findById(courseId);
    console.log(course);
    if (!course) {
      return res
        .status(404)
        .json({ status: "error", data: { message: "Course not found" } });
    }

    if (!user.courses.includes(courseId)) {
      user.courses.push(courseId);
      await user.save();
    }

    if (!course.users.includes(userId)) {
      course.users.push(userId);
      await course.save();
    }

    return res
      .status(201)
      .json({ status: "success", data: { message: "Course added to user" } });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "error", data: { message: err.message } });
  }
};
const deleteUsersByRole = async (req, res) => {
  try {
    const { roles } = req.body; // Expecting roles as an array or a single role string

    // Ensure roles is an array
    const roleArray = Array.isArray(roles) ? roles : [roles];

    const result = await User.deleteMany({ role: { $in: roleArray } });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "No users found with the specified role(s)",
      });
    }

    return res.json({
      status: "success",
      message: `${result.deletedCount} user(s) deleted successfully`,
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};
module.exports = {
  getAllUsers,
  deleteUser,
  modifyUser,
  getUserCourses,
  addCourseToUser,
  deleteUsersByRole,
};
