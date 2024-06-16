const { DateTime } = require("luxon");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  time_of_creation: { type: Date },
  description: { type: String, default: "N/A" },
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
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

GameSchema.virtual("time_of_creation_formatted").get(function () {
  return DateTime.fromJSDate(this.time_of_creation).toLocaleString(
    DateTime.DATE_MED
  );
});

module.exports = mongoose.model("Game", GameSchema);
