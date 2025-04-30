const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

exports.searchUsers = async (req, res) => {
  try {
    const query = req.params.query;
    const users = await User.find({ name: new RegExp(query, 'i') }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to search users" });
  }
};
  