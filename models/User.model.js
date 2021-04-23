const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  ratings: [
    {
      type: Schema.Types.ObjectID,
      ref: "Rating",
    }
  ],
  journal: [
    {
    type: Schema.Types.ObjectId,
    ref: "SavedResultsFromAPI"
  }
]
});

const User = model("User", userSchema);

module.exports = User;
