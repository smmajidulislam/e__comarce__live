const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    logo: { type: String },
    facebook: { type: String },
    twitter: { type: String },
    whatsapp: { type: Number },
    gmail: { type: String },
  },
  { timestamps: true }
);

const Setting =
  mongoose.models.Setting || mongoose.model("Setting", settingSchema);

module.exports = Setting;
