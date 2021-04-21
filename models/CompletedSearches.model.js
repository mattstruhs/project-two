const { Schema, model, Mongoose } = require("mongoose");

const completedSearchesSchema = new Schema({
  country: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
  },
  limit: {
    type: String,
    required: false,
  },
  wines: [
    {
      type: Schema.Types.ObjectID,
      ref: "SavedResultsFromAPI",
    },
  ],
});

const completedSearches = model("completedSearches", completedSearchesSchema);

module.exports = completedSearches;
