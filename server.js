require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db_connect");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;
const rootRoutes = require("./routes/root");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const locationRoutes = require("./routes/locationRoutes"); // Import location routes
const sCartRoutes = require("./routes/sCartRoutes"); // Import shopping cart routes

const path = require("path");
const { appendFile } = require("fs");

connectDB();
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "views")));
const NOT_FOUND_FilePath = path.join(__dirname, "views/404.html");
app.use("/", rootRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/tutors", tutorRoutes);
app.use("/api/v1/geolocation", locationRoutes); // Mount location routes
app.use("/api/v1/scart", sCartRoutes); // Mount shopping cart routes

app.all("*", (req, res) => {
  res.sendFile(NOT_FOUND_FilePath);
});

// Start the server
mongoose.connection.once("open", () => {
  console.log("db connected");

  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
