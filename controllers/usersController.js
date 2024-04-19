const User = require("../models/User");
const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users.length) return res.json({ message: "no users found" });
  return res.json(users);
};

module.exports = { getAllUsers };
