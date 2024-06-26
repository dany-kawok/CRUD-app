const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");
const verifyJWT = require("../middleware/verifyJWT");
const allowedTo = require("../middleware/allowedTo");
const userRoles = require("../utils/userRoles");

// Apply JWT verification middleware to all routes
router.use(verifyJWT);

// Routes for user operations
router.route("/").get(usersController.getAllUsers);

// Routes for user courses
router
  .route("/courses")
  .get(usersController.getUserCourses)
  .post(usersController.addCourseToUser)
  .delete(
    allowedTo(userRoles.ADMIN, userRoles.USER),
    usersController.deleteAllCoursesOfUser
  ); // Apply allowedTo middleware here

router
  .route("/courses/:courseId") // Updated to include courseId in the URL
  .delete(usersController.deleteCourseOfTheUser);

// Route for deleting users by role
router
  .route("/deleteByRole")
  .post(allowedTo(userRoles.ADMIN), usersController.deleteUsersByRole);

router
  .route("/:userId")
  .get(usersController.getUserById)
  .delete(allowedTo(userRoles.ADMIN), usersController.deleteUser)
  .patch(
    allowedTo(userRoles.ADMIN, userRoles.MODERATOR),
    usersController.modifyUser
  );

module.exports = router;
