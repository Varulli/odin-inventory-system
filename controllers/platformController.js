const debug = require("debug")("odin-inventory-system:platformController");

const Platform = require("../models/platform");
const Game = require("../models/game");

const asyncHandler = require("express-async-handler");
const { isValidObjectId } = require("mongoose");
const { checkSchema, validationResult } = require("express-validator");

// Display list of all Platforms.
exports.platform_list = asyncHandler(async (req, res, next) => {
  const platforms = await Platform.find({}, { name: 1 })
    .sort({ name: 1 })
    .exec();
  res.render("platform_list", {
    title: "List of Platforms",
    platform_list: platforms,
  });
});

// Display detail page for a specific Platform.
exports.platform_detail = function (req, res) {
  res.send("NOT IMPLEMENTED: Platform detail: " + req.params.id);
};

// Display Platform create form on GET.
exports.platform_create_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Platform create GET");
};

// Handle Platform create on POST.
exports.platform_create_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Platform create POST");
};

// Display Platform delete form on GET.
exports.platform_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Platform delete GET");
};

// Handle Platform delete on POST.
exports.platform_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Platform delete POST");
};

// Display Platform update form on GET.
exports.platform_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Platform update GET");
};

// Handle Platform update on POST.
exports.platform_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Platform update POST");
};
