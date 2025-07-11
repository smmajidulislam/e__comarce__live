const mongoose = require("mongoose");
const verificationModel = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // 10 minutes
  },
});
const Verification =
  mongoose.models.Verification ||
  mongoose.model("Verification", verificationModel);
module.exports = Verification;
