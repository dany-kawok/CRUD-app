const express = require("express");
const router = express.Router();

const tutorsController = require("../controllers/tutorsController");
const verifyJWT = require("../middleware/verifyJWT");
const allowedTo = require("../middleware/allowedTo");
const userRoles = require("../utils/userRoles");

router.use(verifyJWT);

// Only admins can access these routes
router
  .route("/")
  .get(tutorsController.getAllTutors)
  .post(allowedTo(userRoles.ADMIN), tutorsController.createTutor);

router
  .route("/:tutorId")
  .get(tutorsController.getTutorById)
  .patch(
    allowedTo(userRoles.ADMIN, userRoles.MODERATOR),
    tutorsController.updateTutor
  )
  .delete(allowedTo(userRoles.ADMIN), tutorsController.deleteTutor);

// Tutors can manage their courses
router
  .route("/:tutorId/courses")
  .get(tutorsController.getTutorCourses)
  .post(
    allowedTo(userRoles.ADMIN, userRoles.MODERATOR),
    tutorsController.addCourseToTutor
  );

module.exports = router;
