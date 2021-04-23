const { Schema, model } = require("mongoose");

const starSchema = new Schema({
  rating: {
    type: Number,
    required: false,
    unique: false
  },
  wine_id: {
    type: String,
    required: false
  },
});

const Rating = model("Rating", starSchema);

module.exports = Rating;