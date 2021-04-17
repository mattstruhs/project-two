const { Schema, model } = require("mongoose");

const journalSchema = new Schema({
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
    // enum: ["Red", "rosé", "white"],
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
  writeUp: {
    type: String,
    required: false,
  },
});

const Journal = model("Journal", journalSchema);

module.exports = Journal;
