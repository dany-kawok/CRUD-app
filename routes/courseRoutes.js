const express = require("express");
const router = express.Router();

const coursesController = require("../controllers/coursesController");
const verifyJWT = require("../middleware/verifyJWT");
const allowedTo = require("../middleware/allowedTo");
// const courseUsersController = require("../controllers/courseUsersController");
const { getTutorCourses } = require("../controllers/tutorsController");
const userRoles = require("../utils/userRoles");

// router.use(verifyJWT);

router
  .route("/")
  .get(coursesController.getAllCourses)
  .post(verifyJWT, allowedTo(userRoles.ADMIN), coursesController.createCourse);
// router.use(verifyJWT);
router
  .route("/:courseId")
  .get(coursesController.getCourseById)
  .patch(
    verifyJWT,
    allowedTo(userRoles.ADMIN, userRoles.MODERATOR),
    coursesController.updateCourse
  ) // Using PATCH for partial updates
  .delete(
    verifyJWT,
    allowedTo(userRoles.ADMIN),
    coursesController.deleteCourse
  );

router
  .route("/:courseId/users")
  .get(coursesController.getCourseUsers)
  .post(
    verifyJWT,
    allowedTo(userRoles.ADMIN, userRoles.MODERATOR),
    coursesController.addUserToCourse
  );
router
  .route("/:courseId/tutors")
  .get(coursesController.getCourseTutors)
  .post(
    verifyJWT,
    allowedTo(userRoles.ADMIN, userRoles.MODERATOR),
    coursesController.addTutorToCourse
  ); // Route for getting tutors of a specific course
router.route("/search/:searchText").get(coursesController.searchCourses); // search route

module.exports = router;
