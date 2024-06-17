const { DateTime } = require("luxon");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  time_of_creation: { type: Number, min: 1960, max: DateTime.local().year },
  description: { type: String, default: "N/A" },
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
  platform: [{ type: Schema.Types.ObjectId, ref: "Platform" }],
  developer: { type: Schema.Types.ObjectId, ref: "Developer" },
  publisher: { type: Schema.Types.ObjectId, ref: "Publisher" },
});

GameSchema.virtual("url").get(function () {
  return (
    "/inventory/game/" +
    this._id +
    "/" +
    this.name.toLowerCase().replace(/ /g, "_")
  );
});

module.exports = mongoose.model("Game", GameSchema);
