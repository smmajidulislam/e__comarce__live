const Slider = require("../models/sliderModel");

// Create a new slider
const createSlider = async (req, res) => {
  try {
    const { image } = req.body;

    if (!image || typeof image !== "string" || image.trim() === "") {
      return res
        .status(400)
        .json({ message: "Image is required and must be a non-empty string" });
    }

    const slider = await Slider.create({ image });
    res.status(201).json({ success: true, data: slider });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Get all sliders
const getSliders = async (req, res) => {
  try {
    const sliders = await Slider.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: sliders });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Get single slider by ID
const getSliderById = async (req, res) => {
  try {
    const slider = await Slider.findById(req.params.id);
    if (!slider) {
      return res
        .status(404)
        .json({ success: false, message: "Slider not found" });
    }
    res.status(200).json({ success: true, data: slider });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Update slider by ID
const updateSlider = async (req, res) => {
  try {
    const { image } = req.body;

    const slider = await Slider.findById(req.params.id);
    if (!slider) {
      return res
        .status(404)
        .json({ success: false, message: "Slider not found" });
    }

    if (image && typeof image === "string" && image.trim() !== "") {
      slider.image = image;
    }

    await slider.save();
    res.status(200).json({ success: true, data: slider });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

// Delete slider by ID
const deleteSlider = async (req, res) => {
  try {
    const slider = await Slider.findByIdAndDelete(req.params.id);
    if (!slider) {
      return res
        .status(404)
        .json({ success: false, message: "Slider not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Slider deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

module.exports = {
  createSlider,
  getSliders,
  getSliderById,
  updateSlider,
  deleteSlider,
};
