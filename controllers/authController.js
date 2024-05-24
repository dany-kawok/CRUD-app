const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!first_name || !last_name || !email || !password) {
    return res
      .status(400)
      .json({ status: "failure", message: "All fields are required" });
  }

  // Check if email matches the email format
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ status: "failure", message: "Invalid email format" });
  }

  const foundUser = await User.findOne({ email }).exec();
  if (foundUser) {
    return res
      .status(401)
      .json({ status: "failure", message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    first_name,
    last_name,
    email,
    password: hashedPassword,
  });

  const accessToken = jwt.sign(
    { UserInfo: { id: user._id } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { UserInfo: { id: user._id } },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true, // Accessible by web servers only
    secure: true, // Should be served over HTTPS, adjust according to your environment
    sameSite: "None", // Cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  res.status(201).json({
    status: "success",
    data: {
      accessToken,
      user: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: "failure", message: "All fields are required" });
  }

  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) {
    return res
      .status(401)
      .json({ status: "failure", message: "User not found" });
  }

  const match = await bcrypt.compare(password, foundUser.password);
  if (!match)
    return res
      .status(401)
      .json({ status: "failure", message: "Wrong password" });

  const accessToken = jwt.sign(
    { UserInfo: { id: foundUser._id } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { UserInfo: { id: foundUser._id } },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true, // Accessible by web servers only
    secure: true, // Should be served over HTTPS, adjust according to your environment
    sameSite: "None", // Cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  res.status(200).json({
    status: "success",
    data: {
      accessToken,
      user: {
        email: foundUser.email,
      },
    },
  });
};

const refreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt)
    return res.status(401).json({ status: "failure", message: "Unauthorized" });

  const refreshToken = cookies.jwt;
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err)
        return res
          .status(403)
          .json({ status: "failure", message: "Forbidden" });

      const foundUser = await User.findById(decoded.UserInfo.id).exec();
      if (!foundUser)
        return res
          .status(401)
          .json({ status: "failure", message: "Unauthorized" });

      const accessToken = jwt.sign(
        { UserInfo: { id: foundUser._id } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.status(200).json({
        status: "success",
        data: {
          accessToken,
        },
      });
    }
  );
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content to send back

  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  res.status(200).json({ status: "success", message: "Cookie cleared" });
};

module.exports = { register, login, refreshToken, logout };
