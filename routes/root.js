const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/", (req, res) => {
  console.log("dany");
  return res.status(200).json({ message: "hello world" });
});

module.exports = router;
