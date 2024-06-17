const debug = require("debug")("odin-inventory-system:genreController");

const Game = require("../models/game");
const Genre = require("../models/genre");

const asyncHandler = require("express-async-handler");
const { isValidObjectId } = require("mongoose");
const { checkSchema, validationResult } = require("express-validator");

// Display list of all Genres.
exports.genre_list = asyncHandler(async (req, res, next) => {
  const genres = await Genre.find({}, { name: 1 }).sort({ name: 1 }).exec();
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
    Game.find({ genre: req.params.id }, { name: 1, description: 1 }).exec(),
  ]);
  res.render("genre_detail", {
    title: `Genre: ${genre.name}`,
    genre,
    genre_games,
  });
});

// Display Genre create form on GET.
exports.genre_create_get = asyncHandler(async (req, res, next) => {
  res.render("genre_form", { title: "Create Genre" });
});

// Handle Genre create on POST.
exports.genre_create_post = [
  checkSchema({
    name: {
      in: ["body"],
      trim: true,
      isLength: {
        options: { min: 1 },
        errorMessage: "* Name is a required field",
      },
      escape: true,
    },
  }),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: "Create Genre",
        genre: req.body,
        errors: new Map(errors.array().map((error) => [error.path, error.msg])),
      });
      return;
    }

    const genre = new Genre({ name: req.body.name });
    await genre.save();
    res.redirect(genre.url);
  }),
];

// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    const err = new Error("Invalid Genre ID");
    err.status = 404;
    return next(err);
  }

  const [genre, genre_games] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Game.find({ genre: req.params.id }, { name: 1, description: 1 }).exec(),
  ]);
  res.render("genre_delete", {
    title: `Delete Genre: ${genre.name}`,
    genre,
    genre_games,
  });
});

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    const err = new Error("Invalid Genre ID");
    err.status = 404;
    return next(err);
  }

  await Promise.all([
    Game.updateMany(
      { genre: req.params.id },
      { $pull: { genre: req.params.id } }
    ).exec(),
    Genre.findByIdAndDelete(req.params.id).exec(),
  ]);
  res.redirect("/inventory/genres");
});

// Display Genre update form on GET.
exports.genre_update_get = function (req, res) {
  if (!isValidObjectId(req.params.id)) {
    const err = new Error("Invalid Genre ID");
    err.status = 404;
    return next(err);
  }

  res.send("NOT IMPLEMENTED: Genre update GET");
};

// Handle Genre update on POST.
exports.genre_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Genre update POST");
};
