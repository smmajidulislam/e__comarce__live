const mongoose = require("mongoose");
const sliderSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  createAd: {
    type: Date,
    default: Date.now,
  },
});

const Slider = mongoose.models.Slider || mongoose.model("Slider", sliderSchema);
module.exports = Slider;
