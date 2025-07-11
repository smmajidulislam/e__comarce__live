const User = require("../models/userModel");
const Verification = require("../models/verificatonModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const sendEmail = require("../utils/sendEmail");

const login = async (req, res) => {
  const { email, password, remember } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Cookie ও JWT মেয়াদ হিসাব
    const tokenExpiry = remember ? "365d" : "1d"; // JWT এর জন্য
    const cookieMaxAge = remember
      ? 365 * 24 * 60 * 60 * 1000
      : 1 * 24 * 60 * 60 * 1000; // ms

    // Token তৈরি
    const token = jwt.sign(
      {
        _id: existingUser._id,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      },
      process.env.AUTH_SECRECT,
      { expiresIn: tokenExpiry }
    );

    // Cookie সেট
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: cookieMaxAge,
    });

    const data = {
      _id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.isAdmin,
    };

    return res.status(200).json({
      ok: true,
      message: "Login successfully",
      data,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

const singUP = async (req, res) => {
  const { name, email, password, phone } = req.body;
  console.log(name, email, password, phone);
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, phone });
    await user.save();
    return res
      .status(201)
      .json({ ok: true, message: "User created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};
const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ ok: true, message: "Logout successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};
const updatePassword = async (req, res) => {
  try {
    const { password, email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    return res
      .status(200)
      .json({ ok: true, message: "Password updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isExistingverificationCode = await Verification.findOne({ email });
    if (isExistingverificationCode) {
      return res
        .status(400)
        .json({ message: "Verification code already sent" });
    }
    const code = Math.floor(100000 + Math.random() * 900000);
    const verificationCode = new Verification({ email, code });
    await verificationCode.save();
    const mailData = {
      email,
      subject: "Password Reset Code",
      message: `Your password reset code is: ${code}`,
    };
    await sendEmail(mailData);
    return res
      .status(200)
      .json({ ok: true, message: "Code sent successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};
const confromCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const verificationCode = await Verification.findOne({ email, code });
    if (!verificationCode) {
      return res.status(400).json({ message: "Invalid code" });
    }
    await Verification.findByIdAndDelete(verificationCode._id);
    return res
      .status(200)
      .json({ ok: true, message: "Code confirmed successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  login,
  singUP,
  logOut,
  updatePassword,
  forgotPassword,
  confromCode,
};
