const User = require("../models/userModel"); // Mongoose Model ধরে নিচ্ছি

// @desc Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// @desc Create a user (optional if you need Create)
const createUser = async (req, res) => {
  try {
    const { name, email, phone, image, password } = req.body;

    if (!name || !email || !phone || !image || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newUser = new User({ name, email, phone, image, password });
    const savedUser = await newUser.save();
    console.log(savedUser);

    res.status(201).json(savedUser);
  } catch (err) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// @desc Update a user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, image } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (image !== undefined) updateData.image = image;

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
};

// @desc Delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted", id });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
};

// @desc Get a user
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    user.password = undefined;
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
};

// @desc Get user by email
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
};

// @desc Get user by phone
const getUserByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Internal server error" });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  getUserByEmail,
  getUserByPhone,
};
