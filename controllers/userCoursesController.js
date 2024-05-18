const User = require("../models/User");
const Course = require("../models/Course");

// Get all courses for a specific user
const getUserCourses = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId).populate("courses").lean();
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json(user.courses);
};

// Add a course to a specific user
const addCourseToUser = async (req, res) => {
  const userId = req.params.userId;
  const { courseId } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: "Course not found" });

  if (!user.courses.includes(courseId)) {
    user.courses.push(courseId);
    await user.save();
  }

  if (!course.users.includes(userId)) {
    course.users.push(userId);
    await course.save();
  }

  return res.status(201).json({ message: "Course added to user" });
};

module.exports = {
  getUserCourses,
  addCourseToUser,
};
