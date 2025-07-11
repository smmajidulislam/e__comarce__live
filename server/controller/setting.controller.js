const Setting = require("../models/setttingModel");

// Get settings
const getSetting = async (req, res) => {
  try {
    const setting = await Setting.findOne();
    return res.status(200).json(setting);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Create or Update
const updateSetting = async (req, res) => {
  try {
    const { logo, facebook, twitter, whatsapp, gmail } = req.body;
    let setting = await Setting.findOne();
    if (setting) {
      setting.logo = logo;
      setting.facebook = facebook;
      setting.twitter = twitter;
      setting.whatsapp = whatsapp;
      setting.gmail = gmail;
      await setting.save();
    } else {
      setting = await Setting.create({
        logo,
        facebook,
        twitter,
        whatsapp,
        gmail,
      });
    }
    return res.status(200).json(setting);
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Delete logo only
const deleteLogo = async (req, res) => {
  try {
    const setting = await Setting.findOne();
    if (setting) {
      setting.logo = "";
      await setting.save();
      res.json({ message: "Logo deleted" });
    } else {
      res.status(404).json({ message: "Setting not found" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  getSetting,
  updateSetting,
  deleteLogo,
};
