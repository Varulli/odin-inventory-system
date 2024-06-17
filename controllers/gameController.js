const debug = require("debug")("odin-inventory-system:gameController");

const Game = require("../models/game");
const Genre = require("../models/genre");
const Platform = require("../models/platform");
const Developer = require("../models/developer");
const Publisher = require("../models/publisher");

const asyncHandler = require("express-async-handler");

// GET inventory home page.
exports.index = asyncHandler(async (req, res, next) => {
  const [
    game_count,
    genre_count,
    platform_count,
    developer_count,
    publisher_count,
  ] = await Promise.all([
    Game.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
    Platform.countDocuments({}).exec(),
    Developer.countDocuments({}).exec(),
    Publisher.countDocuments({}).exec(),
  ]);
  res.render("index", {
    title: "Videogame Inventory",
    game_count,
    genre_count,
    platform_count,
    developer_count,
    publisher_count,
  });
});

// Display list of all Games.
exports.game_list = function (req, res) {
  res.send("NOT IMPLEMENTED: Game list");
};

// Display detail page for a specific Game.
exports.game_detail = function (req, res) {
  res.send("NOT IMPLEMENTED: Game detail: " + req.params.id);
};

// Display Game create form on GET.
exports.game_create_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Game create GET");
};

// Handle Game create on POST.
exports.game_create_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Game create POST");
};

// Display Game delete form on GET.
exports.game_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Game delete GET");
};

// Handle Game delete on POST.
exports.game_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Game delete POST");
};

// Display Game update form on GET.
exports.game_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Game update GET");
};

// Handle Game update on POST.
exports.game_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Game update POST");
};
