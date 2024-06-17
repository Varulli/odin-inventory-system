const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  name: { type: String, required: true, max: 100, unique: true },
});

GenreSchema.virtual("url").get(function () {
  return (
    "/inventory/genre/" +
    this._id +
    "/" +
    this.name.toLowerCase().replace(/ /g, "_")
  );
});

module.exports = mongoose.model("Genre", GenreSchema);
