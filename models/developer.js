const { DateTime } = require("luxon");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeveloperSchema = new Schema({
  name: { type: String, required: true, max: 100, unique: true },
  time_of_creation: { type: Date },
  type: { type: String, required: true, enum: ["N/A", "Indie", "Studio"] },
});

DeveloperSchema.virtual("url").get(function () {
  return "/inventory/developer/" + this.name.toLowerCase().replace(/ /g, "_");
});

DeveloperSchema.virtual("time_of_creation_formatted").get(function () {
  return DateTime.fromJSDate(this.time_of_creation).toLocaleString(
    DateTime.DATE_MED
  );
});

module.exports = mongoose.model("Developer", DeveloperSchema);
