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
    const userId = req.user._id;
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
  const userId = req.user._id;
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
// Add courses to a specific user
const addCourseToUser = async (req, res) => {
  const userId = req.user._id;
  const { courseIds } = req.body; // Expect courseIds to be an array

  if (!Array.isArray(courseIds) || courseIds.length === 0) {
    return res.status(400).json({
      status: "error",
      message: "courseIds must be a non-empty array",
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", data: { message: "User not found" } });
    }

    const courses = await Course.find({ _id: { $in: courseIds } });
    const validCourseIds = courses.map((course) => course._id.toString());
    const invalidCourseIds = courseIds.filter(
      (id) => !validCourseIds.includes(id)
    );

    // Add only valid courses to the user's courses array if not already present
    validCourseIds.forEach((courseId) => {
      if (!user.courses.includes(courseId)) {
        user.courses.push(courseId);
      }
    });
    await user.save();

    // Add the user to each course's users array
    for (const course of courses) {
      if (!course.users.includes(userId)) {
        course.users.push(userId);
        await course.save();
      }
    }

    return res.status(201).json({
      status: "success",
      data: { message: "Courses added to user", invalidCourseIds },
    });
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

// Get user by ID
const getUserById = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).select("-password").lean();
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

// Delete a course from a specific user
const deleteCourseOfTheUser = async (req, res) => {
  const userId = req.user._id;
  console.log(req);
  const { courseId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ status: "error", message: "Course not found" });
    }

    // Remove course from user's courses array
    user.courses = user.courses.filter((id) => id.toString() !== courseId);
    await user.save();

    // Remove user from course's users array
    course.users = course.users.filter((id) => id.toString() !== userId);
    await course.save();

    return res.status(200).json({
      status: "success",
      data: { message: "Course removed from user" },
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

// Existing functions...

// Delete all courses of the user
const deleteAllCoursesOfUser = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    // Remove user from all courses
    await Course.updateMany({ users: userId }, { $pull: { users: userId } });

    // Clear the user's courses array
    user.courses = [];
    await user.save();

    return res.status(200).json({
      status: "success",
      data: { message: "All courses removed from user" },
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
  getUserById,
  deleteCourseOfTheUser,
  deleteAllCoursesOfUser, // Add the new function here
};
