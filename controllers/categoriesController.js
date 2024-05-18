// controllers/categoriesController.js
const Category = require("../models/Category");
const Course = require("../models/Course");

const createCategory = async (req, res) => {
  const { name, image } = req.body;

  try {
    const category = new Category({ name, image });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllCategories = async (req, res) => {
  const categories = await Category.find().lean();
  if (!categories.length) return res.json({ message: "No categories found" });
  res.json(categories);
};

const getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.categoryId).lean();
  if (!category) return res.status(404).json({ message: "Category not found" });
  res.json(category);
};

const getCategoryCourses = async (req, res) => {
  const courses = await Course.find({ category: req.params.categoryId }).lean();
  if (!courses.length)
    return res.json({ message: "No courses found for this category" });
  res.json(courses);
};

const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete related courses
    await Course.deleteMany({ category: categoryId });

    // Delete category
    await Category.findByIdAndDelete(categoryId);

    res
      .status(200)
      .json({ message: "Category and related courses deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const { name, image } = req.body;

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update category fields
    if (name) category.name = name;
    if (image) category.image = image;

    await category.save();

    res.status(200).json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
