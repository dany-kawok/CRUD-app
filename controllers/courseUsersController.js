const User = require("../models/User");
const Course = require("../models/Course");

// Get all users for a specific course
const getCourseUsers = async (req, res) => {
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId)
    .populate("users", "-password")
    .lean();
  if (!course) return res.status(404).json({ message: "Course not found" });
  return res.json(course.users);
};

// Add a user to a specific course
const addUserToCourse = async (req, res) => {
  const courseId = req.params.courseId;
  const { userId } = req.body;

  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: "Course not found" });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (!course.users.includes(userId)) {
    course.users.push(userId);
    await course.save();
  }

  if (!user.courses.includes(courseId)) {
    user.courses.push(courseId);
    await user.save();
  }

  return res.status(201).json({ message: "User added to course" });
};

module.exports = {
  getCourseUsers,
  addUserToCourse,
};
