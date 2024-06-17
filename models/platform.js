const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlatformSchema = new Schema({
  name: { type: String, required: true, max: 100, unique: true },
});

PlatformSchema.virtual("url").get(function () {
  return (
    "/inventory/platform/" +
    this._id +
    "/" +
    this.name.toLowerCase().replace(/ /g, "_")
  );
});

module.exports = mongoose.model("Platform", PlatformSchema);
