const { Schema, model } = require("mongoose");

const journalSchema = new Schema({
  wine_id: {
    type: Number,
    required: false,
    unique: true,
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
    enum: ["red", "rosé", "white"],
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
    type: Text,
    required: false,
  },
});

const Journal = model("Journal", journalSchema);

module.exports = Journal;
