const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");
const verifyJWT = require("../middleware/verifyJWT");
const allowedTo = require("../middleware/allowedTo");
// const userCoursesController = require("../controllers/userCoursesController");
const userRoles = require("../utils/userRoles");
router.use(verifyJWT);
router.route("/").get(verifyJWT, usersController.getAllUsers);

router
  .route("/:userId")
  .delete(allowedTo(userRoles.ADMIN), usersController.deleteUser)
  .patch(
    allowedTo(userRoles.ADMIN, userRoles.MODERATOR),
    usersController.modifyUser
  );
router
  .route("/:userId/courses")
  .get(usersController.getUserCourses)
  .post(
    allowedTo(userRoles.ADMIN, userRoles.MODERATOR),
    usersController.addCourseToUser
  );
router
  .route("/deleteByRole")
  .post(allowedTo(userRoles.ADMIN), usersController.deleteUsersByRole); // Add this line for the new route

module.exports = router;
