const express = require("express");
const router = express.Router();

const coursesController = require("../controllers/coursesController");
const verifyJWT = require("../middleware/verifyJWT");
const allowedTo = require("../middleware/allowedTo");
// const courseUsersController = require("../controllers/courseUsersController");
const { getTutorCourses } = require("../controllers/tutorsController");
const userRoles = require("../utils/userRoles");

router.use(verifyJWT);

router
  .route("/")
  .get(coursesController.getAllCourses)
  .post(allowedTo(userRoles.ADMIN), coursesController.createCourse);

router
  .route("/:courseId")
  .get(coursesController.getCourseById)
  .patch(
    allowedTo(userRoles.ADMIN, userRoles.MODERATOR),
    coursesController.updateCourse
  ) // Using PATCH for partial updates
  .delete(allowedTo(userRoles.ADMIN), coursesController.deleteCourse);

router
  .route("/:courseId/users")
  .get(coursesController.getCourseUsers)
  .post(
    allowedTo(userRoles.ADMIN, userRoles.MODERATOR),
    coursesController.addUserToCourse
  );
router
  .route("/:courseId/tutors")
  .get(coursesController.getCourseTutors)
  .post(
    allowedTo(userRoles.ADMIN, userRoles.MODERATOR),
    coursesController.addTutorToCourse
  ); // Route for getting tutors of a specific course

module.exports = router;
