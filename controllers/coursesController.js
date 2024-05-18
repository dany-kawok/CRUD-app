const Course = require("../models/Course");
const User = require("../models/User");

// Get all courses
const getAllCourses = async (req, res) => {
  const courses = await Course.find().populate("users", "-password").lean();
  if (!courses.length) return res.json({ message: "No courses found" });
  return res.json(courses);
};

// Create a new course
const createCourse = async (req, res) => {
  const { title, description, userIds, category, image } = req.body;

  try {
    const course = new Course({
      title,
      description,
      users: userIds,
      category,
      image,
    });
    await course.save();

    await User.updateMany(
      { _id: { $in: userIds } },
      { $push: { courses: course._id } }
    );

    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get a course by ID
const getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate("users", "-password")
    .lean();
  if (!course) return res.status(404).json({ message: "Course not found" });
  return res.json(course);
};

// Update a course
const updateCourse = async (req, res) => {
  const { title, description, userIds } = req.body;
  const course = await Course.findByIdAndUpdate(
    req.params.id,
    { title, description, users: userIds },
    { new: true }
  ).populate("users", "-password");

  if (!course) return res.status(404).json({ message: "Course not found" });

  res.json(course);
};

// Delete a course
const deleteCourse = async (req, res) => {
  console.log(req.params.courseId);
  const course = await Course.findByIdAndDelete(req.params.courseId);
  if (!course) return res.status(404).json({ message: "Course not found" });

  // Remove course reference from users
  await User.updateMany(
    { _id: { $in: course.users } },
    { $pull: { courses: course._id } }
  );

  res.json({ message: "Course deleted" });
};

module.exports = {
  getAllCourses,
  createCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
};
