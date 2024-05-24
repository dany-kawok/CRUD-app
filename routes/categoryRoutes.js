// routes/categoryRoute.js
const express = require("express");
const router = express.Router();

const categoriesController = require("../controllers/categoriesController");
const verifyJWT = require("../middleware/verifyJWT");
const allowedTo = require("../middleware/allowedTo");
const userRoles = require("../utils/userRoles");

router.use(verifyJWT);

router
  .route("/")
  .get(categoriesController.getAllCategories)
  .post(allowedTo(userRoles.ADMIN), categoriesController.createCategory);

router
  .route("/:categoryId")
  .get(categoriesController.getCategoryById)
  .put(
    allowedTo(userRoles.ADMIN, userRoles.MODERATOR),
    categoriesController.updateCategory
  )
  .delete(allowedTo(userRoles.ADMIN), categoriesController.deleteCategory);

router
  .route("/:categoryId/courses")
  .get(categoriesController.getCategoryCourses);

module.exports = router;
