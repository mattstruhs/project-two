const { Schema, model } = require("mongoose");

const notesSchema = new Schema({
  hue: {
    type: String,
    required: false,
    unique: false,
  },
  smell: {
    type: String,
    required: false,
    unique: false,
  },
  taste: {
    type: String,
    required: false,
    unique: false,
  },
  wine_id: {
    type: Schema.Types.ObjectId,
    ref: "SavedResultsFromAPI",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const TastingNotes = model("TastingNotes", notesSchema);

module.exports = TastingNotes;
