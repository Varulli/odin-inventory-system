const debug = require("debug")("odin-inventory-system:genreController");

const Game = require("../models/game");
const Genre = require("../models/genre");

const asyncHandler = require("express-async-handler");
const { isValidObjectId } = require("mongoose");

// Display list of all Genres.
exports.genre_list = asyncHandler(async (req, res, next) => {
  const genres = await Genre.find().sort({ name: 1 }).exec();
  res.render("genre_list", { title: "List of Genres", genre_list: genres });
});

// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    const err = new Error("Invalid Genre ID");
    err.status = 404;
    return next(err);
  }

  const [genre, genre_games] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Game.find({ genre: req.params.id }).exec(),
  ]);
  console.log(genre_games);
  res.render("genre_detail", {
    title: `Genre: ${genre.name}`,
    genre,
    genre_games,
  });
});

// Display Genre create form on GET.
exports.genre_create_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre create GET");
};

// Handle Genre create on POST.
exports.genre_create_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre create POST");
};

// Display Genre delete form on GET.
exports.genre_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre delete GET");
};

// Handle Genre delete on POST.
exports.genre_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre delete POST");
};

// Display Genre update form on GET.
exports.genre_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre update GET");
};

// Handle Genre update on POST.
exports.genre_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre update POST");
};
