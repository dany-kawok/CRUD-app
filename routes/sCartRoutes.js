const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const sCartController = require("../controllers/sCartController");

// Apply verifyJWT middleware to protect routes
router.use(verifyJWT);

router.post("/", sCartController.addCourseToCart);
router.delete("/", sCartController.removeCourseFromCart);
router.get("/", sCartController.getUserCart);
router.delete("/clear", sCartController.clearUserCart);

module.exports = router;
