const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

const getUserById = async (req, res) => {
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

const searchUsers = async (req, res) => {
  try {
    const query = req.params.query;
    const users = await User.find({ name: new RegExp(query, 'i') }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to search users" });
  }
};

const updateNotificationSettings = async (req, res) => {
  try {
    const { notificationSettings } = req.body;
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      { notificationSettings },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Notification settings updated successfully', user });
  } catch (error) {
    console.error('Error updating notification settings:', error);
    res.status(500).json({ message: 'Error updating notification settings' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  searchUsers,
  updateNotificationSettings,
};

