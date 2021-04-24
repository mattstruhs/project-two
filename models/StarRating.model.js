const { Schema, model } = require("mongoose");

const starSchema = new Schema({
  rating: {
    type: Number,
    required: false,
    unique: false
  },
  wine_id: {
    type: Schema.Types.ObjectId,
    ref: "SavedResultsFromAPI"
  },
  user: {
      type: Schema.Types.ObjectId,
      ref: "User"
  }
});

const Rating = model("Rating", starSchema);

module.exports = Rating;