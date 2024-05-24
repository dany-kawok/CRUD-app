const Course = require("../models/Course");
const User = require("../models/User");
const Tutor = require("../models/Tutor");

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("users", "-password").lean();
    if (!courses.length) {
      return res.json({
        status: "error",
        data: { message: "No courses found" },
      });
    }
    return res.json({ status: "success", data: courses });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "error", data: { message: err.message } });
  }
};

// Create a new course
const createCourse = async (req, res) => {
  const {
    title,
    description,
    userIds = [],
    tutorIds = [],
    category,
    image,
  } = req.body;

  try {
    // Ensure no duplicate users or tutors are added to the course
    const uniqueUserIds = [...new Set(userIds)];
    const uniqueTutorIds = [...new Set(tutorIds)];

    const course = new Course({
      title,
      description,
      users: uniqueUserIds,
      tutors: uniqueTutorIds,
      category,
      image,
    });

    await course.save();

    // Update users to include this course
    await User.updateMany(
      { _id: { $in: uniqueUserIds } },
      { $addToSet: { courses: course._id } }
    );

    // Update tutors to include this course
    await Tutor.updateMany(
      { _id: { $in: uniqueTutorIds } },
      { $addToSet: { courses: course._id } }
    );

    res.status(201).json({ status: "success", data: course });
  } catch (err) {
    res.status(400).json({ status: "error", data: { message: err.message } });
  }
};

// Get a course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate("users", "-password")
      .lean();
    if (!course) {
      return res
        .status(404)
        .json({ status: "error", data: { message: "Course not found" } });
    }
    return res.json({ status: "success", data: course });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "error", data: { message: err.message } });
  }
};

// Update a course
const updateCourse = async (req, res) => {
  const { courseId } = req.params;
  const updates = req.body;

  try {
    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ status: "error", message: "Course not found" });
    }

    // Update the fields that are present in the request
    Object.keys(updates).forEach((key) => {
      course[key] = updates[key];
    });

    // Save the updated course
    await course.save();

    // Populate the tutors and respond with the updated course
    const updatedCourse = await Course.findById(courseId)
      .populate("tutors")
      .lean();

    res.status(200).json({ status: "success", data: updatedCourse });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.courseId);
    if (!course) {
      return res
        .status(404)
        .json({ status: "error", data: { message: "Course not found" } });
    }

    // Remove course reference from users
    await User.updateMany(
      { _id: { $in: course.users } },
      { $pull: { courses: course._id } }
    );

    res.json({ status: "success", data: { message: "Course deleted" } });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "error", data: { message: err.message } });
  }
};
// Get tutors of a specific course
const getCourseTutors = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate("tutors")
      .lean();
    if (!course) {
      return res
        .status(404)
        .json({ status: "error", message: "Course not found" });
    }
    return res.json({ status: "success", data: course.tutors });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

// Get all users for a specific course
const getCourseUsers = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const course = await Course.findById(courseId)
      .populate("users", "-password")
      .lean();

    if (!course) {
      return res
        .status(404)
        .json({ status: "error", data: { message: "Course not found" } });
    }

    return res.json({ status: "success", data: course.users });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "error", data: { message: err.message } });
  }
};

// Add a user to a specific course
const addUserToCourse = async (req, res) => {
  const courseId = req.params.courseId;
  const { userId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ status: "error", data: { message: "Course not found" } });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "error", data: { message: "User not found" } });
    }

    if (!course.users.includes(userId)) {
      course.users.push(userId);
      await course.save();
    }

    if (!user.courses.includes(courseId)) {
      user.courses.push(courseId);
      await user.save();
    }

    return res
      .status(201)
      .json({ status: "success", data: { message: "User added to course" } });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "error", data: { message: err.message } });
  }
};
// Add a tutor to a specific course
const addTutorToCourse = async (req, res) => {
  const courseId = req.params.courseId;
  const { tutorId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ status: "error", data: { message: "Course not found" } });
    }

    const tutor = await Tutor.findById(tutorId);
    console.log(req.body);
    if (!tutor) {
      return res
        .status(404)
        .json({ status: "error", data: { message: "Tutor not found" } });
    }

    if (!course.tutors.includes(tutorId)) {
      course.tutors.push(tutorId);
      await course.save();
    }

    if (!tutor.courses.includes(courseId)) {
      tutor.courses.push(courseId);
      await tutor.save();
    }

    return res
      .status(201)
      .json({ status: "success", data: { message: "Tutor added to course" } });
  } catch (err) {
    return res
      .status(500)
      .json({ status: "error", data: { message: err.message } });
  }
};

module.exports = {
  getAllCourses,
  createCourse,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCourseTutors,
  getCourseUsers,
  addUserToCourse,
  addTutorToCourse,
};
