const { Schema, model } = require("mongoose");

const savedResultsSchema = new Schema({
  wine_id: {
    type: String,
    required: false,
  },
  wine: {
    type: String,
    required: false,
  },
  vintage: {
    type: Number,
    required: false,
  },
  appellation: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
  },
  regions: {
    type: Array,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  score: {
    type: Number,
    required: false,
  },
  myScore: {
    type: Number,
    required: false,
  },
  writeUp: {
    type: String,
    required: false,
  },
  ratings: [{
    type: Schema.Types.ObjectID,
    ref: "Rating",
  }],
  avgRating: {
    type: Number,
    required: false,
  },
  users: [{
    type: Schema.Types.ObjectID,
    ref: "User",
  }],
});

const SavedResultsFromAPI = model("SavedResultsFromAPI", savedResultsSchema);

module.exports = SavedResultsFromAPI;
