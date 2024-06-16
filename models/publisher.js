const { DateTime } = require("luxon");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PublisherSchema = new Schema({
  name: { type: String, required: true, max: 100, unique: true },
  time_of_creation: { type: Date },
});

PublisherSchema.virtual("url").get(function () {
  return "/inventory/publisher/" + this.name.toLowerCase().replace(/ /g, "_");
});

PublisherSchema.virtual("time_of_creation_formatted").get(function () {
  return DateTime.fromJSDate(this.time_of_creation).toLocaleString(
    DateTime.DATE_MED
  );
});

module.exports = mongoose.model("Publisher", PublisherSchema);
