// routes/categoryRoute.js
const express = require("express");
const router = express.Router();

const categoriesController = require("../controllers/categoriesController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(categoriesController.getAllCategories)
  .post(categoriesController.createCategory);

router
  .route("/:categoryId")
  .get(categoriesController.getCategoryById)
  .put(categoriesController.updateCategory)
  .delete(categoriesController.deleteCategory);

router
  .route("/:categoryId/courses")
  .get(categoriesController.getCategoryCourses);

module.exports = router;
