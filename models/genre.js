const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GenreSchema = new Schema({
  name: { type: String, required: true, min: 3, max: 100, unique: true },
});

GenreSchema.virtual("url").get(function () {
  return "/inventory/genre/" + this.name.toLowerCase();
});

module.exports = mongoose.model("Genre", GenreSchema);
