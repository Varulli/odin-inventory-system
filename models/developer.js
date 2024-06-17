const { DateTime } = require("luxon");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DeveloperSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  time_of_creation: { type: Number, min: 1960, max: DateTime.local().year },
  type: { type: String, required: true, enum: ["N/A", "Indie", "Studio"] },
});

DeveloperSchema.virtual("url").get(function () {
  return (
    "/inventory/developer/" +
    this._id +
    "/" +
    this.name.toLowerCase().replace(/ /g, "_")
  );
});

module.exports = mongoose.model("Developer", DeveloperSchema);
