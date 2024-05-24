const Category = require("../models/Category");
const Course = require("../models/Course");

const createCategory = async (req, res) => {
  const { name, image } = req.body;

  try {
    const category = new Category({ name, image });
    await category.save();
    res.status(201).json({ status: "success", data: category });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().lean();
    if (!categories.length)
      return res.json({
        status: "success",
        message: "No categories found",
        data: [],
      });
    res.json({ status: "success", data: categories });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId).lean();
    if (!category)
      return res
        .status(404)
        .json({ status: "error", message: "Category not found" });
    res.json({ status: "success", data: category });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const getCategoryCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      category: req.params.categoryId,
    }).lean();
    if (!courses.length)
      return res.json({
        status: "success",
        message: "No courses found for this category",
        data: [],
      });
    res.json({ status: "success", data: courses });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ status: "error", message: "Category not found" });
    }

    // Delete related courses
    await Course.deleteMany({ category: categoryId });

    // Delete category
    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({
      status: "success",
      message: "Category and related courses deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const { name, image } = req.body;

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ status: "error", message: "Category not found" });
    }

    // Update category fields
    if (name) category.name = name;
    if (image) category.image = image;

    await category.save();

    res.status(200).json({
      status: "success",
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategoryCourses,
  updateCategory,
  deleteCategory,
};
