const Tutor = require("../models/Tutor");
const Course = require("../models/Course");

// Get all tutors
const getAllTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find().lean();
    if (!tutors.length) {
      return res.json({
        status: "success",
        data: [],
        message: "No tutors found",
      });
    }
    return res.json({ status: "success", data: tutors });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

// Create a new tutor
const createTutor = async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;
    const tutor = new Tutor({ first_name, last_name, email });
    await tutor.save();
    return res.status(201).json({ status: "success", data: tutor });
  } catch (err) {
    return res.status(400).json({ status: "error", message: err.message });
  }
};

// Get a tutor by ID
const getTutorById = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.tutorId).lean();
    if (!tutor) {
      return res
        .status(404)
        .json({ status: "error", message: "Tutor not found" });
    }
    return res.json({ status: "success", data: tutor });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

// Update a tutor
const updateTutor = async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;
    const tutor = await Tutor.findByIdAndUpdate(
      req.params.id,
      { first_name, last_name, email },
      { new: true }
    ).lean();
    if (!tutor) {
      return res
        .status(404)
        .json({ status: "error", message: "Tutor not found" });
    }
    return res.json({ status: "success", data: tutor });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

// Delete a tutor
const deleteTutor = async (req, res) => {
  try {
    const tutor = await Tutor.findByIdAndDelete(req.params.id).lean();
    if (!tutor) {
      return res
        .status(404)
        .json({ status: "error", message: "Tutor not found" });
    }
    await Course.updateMany(
      { tutors: req.params.id },
      { $pull: { tutors: req.params.id } }
    );
    return res.json({
      status: "success",
      message: "Tutor deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

// Add a course to a tutor
const addCourseToTutor = async (req, res) => {
  const tutorId = req.params.tutorId;
  const { courseId } = req.body;

  const tutor = await Tutor.findById(tutorId);
  if (!tutor)
    return res
      .status(404)
      .json({ status: "error", message: "Tutor not found" });

  const course = await Course.findById(courseId);
  if (!course)
    return res
      .status(404)
      .json({ status: "error", message: "Course not found" });

  if (!tutor.courses.includes(courseId)) {
    tutor.courses.push(courseId);
    await tutor.save();
  }

  if (!course.tutors.includes(tutorId)) {
    course.tutors.push(tutorId);
    await course.save();
  }

  return res
    .status(201)
    .json({ status: "success", message: "Course added to tutor" });
};

// Get all courses for a tutor
const getTutorCourses = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.tutorId)
      .populate("courses")
      .lean();
    if (!tutor)
      return res
        .status(404)
        .json({ status: "error", message: "Tutor not found" });
    return res.json({ status: "success", data: tutor.courses });
  } catch (err) {
    return res.status(500).json({ status: "error", message: err.message });
  }
};

module.exports = {
  getAllTutors,
  createTutor,
  getTutorById,
  updateTutor,
  deleteTutor,
  addCourseToTutor,
  getTutorCourses,
};
