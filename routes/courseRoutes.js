const express = require("express");
const router = express.Router();

const coursesController = require("../controllers/coursesController");
const verifyJWT = require("../middleware/verifyJWT");
const courseUsersController = require("../controllers/courseUsersController");

router.use(verifyJWT);

router
  .route("/")
  .get(coursesController.getAllCourses)
  .post(coursesController.createCourse);

router
  .route("/:courseId")
  .get(coursesController.getCourseById)
  .put(coursesController.updateCourse)
  .delete(coursesController.deleteCourse);

router
  .route("/:courseId/users")
  .get(courseUsersController.getCourseUsers)
  .post(courseUsersController.addUserToCourse);

module.exports = router;
