const { model } = require("mongoose");

const allowedOrigins = ["http://localhost:3000", "https://lms-plum.vercel.app"];

module.exports = allowedOrigins;
