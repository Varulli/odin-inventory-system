const { DateTime } = require("luxon");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PublisherSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  time_of_creation: { type: Number, min: 1960, max: DateTime.local().year },
});

PublisherSchema.virtual("url").get(function () {
  return (
    "/inventory/publisher/" +
    this._id +
    "/" +
    this.name.toLowerCase().replace(/ /g, "_")
  );
});

module.exports = mongoose.model("Publisher", PublisherSchema);
