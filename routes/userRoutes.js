const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");
const verifyJWT = require("../middleware/verifyJWT");
const userCoursesController = require("../controllers/userCoursesController");

router.use(verifyJWT);
router.route("/").get(usersController.getAllUsers);
router
  .route("/:userId/courses")
  .get(userCoursesController.getUserCourses)
  .post(userCoursesController.addCourseToUser);
module.exports = router;
