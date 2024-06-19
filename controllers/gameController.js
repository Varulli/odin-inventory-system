const debug = require("debug")("odin-inventory-system:gameController");

const Game = require("../models/game");
const Genre = require("../models/genre");
const Platform = require("../models/platform");
const Developer = require("../models/developer");
const Publisher = require("../models/publisher");

const asyncHandler = require("express-async-handler");
const { isValidObjectId } = require("mongoose");
const { checkSchema, validationResult } = require("express-validator");

const min_time_of_creation = Game.schema.path("time_of_creation").options.min;
const max_time_of_creation = Game.schema.path("time_of_creation").options.max;

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
exports.game_list = asyncHandler(async (req, res, next) => {
  const games = await Game.find({}, { name: 1 }).sort({ name: 1 }).exec();
  res.render("game_list", {
    title: "List of Games",
    game_list: games,
  });
});

// Display detail page for a specific Game.
exports.game_detail = asyncHandler(async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    const err = new Error("Invalid Game ID");
    err.status = 404;
    return next(err);
  }

  const game = await Game.findById(req.params.id)
    .populate("genre", "name")
    .populate("platform", "name")
    .populate("developer", "name")
    .populate("publisher", "name")
    .exec();
  res.render("game_detail", {
    title: `Game: ${game.name}`,
    game,
  });
});

// Display Game create form on GET.
exports.game_create_get = asyncHandler(async (req, res, next) => {
  res.render("game_form", {
    title: "Create Game",
    min_time_of_creation,
    max_time_of_creation,
  });
});

// Handle Game create on POST.
exports.game_create_post = [
  checkSchema({
    name: {
      in: ["body"],
      trim: true,
      isLength: {
        options: { min: 1 },
        errorMessage: "Name is a required field",
      },
      escape: true,
      custom: {
        options: async (value) => {
          const game = await Game.findOne({ name: value }).exec();
          return game
            ? Promise.reject("Game already exists")
            : Promise.resolve();
        },
      },
    },
    time_of_creation: {
      in: ["body"],
      trim: true,
      isInt: {
        options: {
          min: min_time_of_creation,
          max: max_time_of_creation,
        },
        errorMessage: `Time of Creation must be between ${min_time_of_creation} and ${max_time_of_creation}`,
      },
      escape: true,
    },
  }),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("game_form", {
        title: "Create Game",
        game: req.body,
        min_time_of_creation,
        max_time_of_creation,
        errors: new Map(errors.array().map((error) => [error.path, error.msg])),
      });
      return;
    }

    const game = new Game({
      name: req.body.name,
      time_of_creation: req.body.time_of_creation,
    });
    await game.save();
    res.redirect(game.url);
  }),
];

// Display Game delete form on GET.
exports.game_delete_get = asyncHandler(async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    const err = new Error("Invalid Game ID");
    err.status = 404;
    return next(err);
  }

  const [game, game_games] = await Promise.all([
    Game.findById(req.params.id).exec(),
    Game.find({ game: req.params.id }, { name: 1, description: 1 })
      .sort({ name: 1 })
      .exec(),
  ]);
  res.render("game_delete", {
    title: `Delete Game: ${game.name}`,
    game,
    game_games,
  });
});

// Handle Game delete on POST.
exports.game_delete_post = asyncHandler(async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    const err = new Error("Invalid Game ID");
    err.status = 404;
    return next(err);
  }

  await Promise.all([
    Game.updateMany({ game: req.params.id }, { $unset: { game: "" } }).exec(),
    Game.findByIdAndDelete(req.params.id).exec(),
  ]);
  res.redirect("/inventory/games");
});

// Display Game update form on GET.
exports.game_update_get = asyncHandler(async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    const err = new Error("Invalid Game ID");
    err.status = 404;
    return next(err);
  }

  const game = await Game.findById(req.params.id).exec();
  res.render("game_form", {
    title: "Update Game",
    game,
    prev_name: game.name,
    min_time_of_creation,
    max_time_of_creation,
  });
});

// Handle Game update on POST.
exports.game_update_post = [
  checkSchema({
    name: {
      in: ["body"],
      trim: true,
      isLength: {
        options: { min: 1 },
        errorMessage: "Name is a required field",
      },
      escape: true,
      custom: {
        options: async (value) => {
          const game = await Game.findOne({ name: value }).exec();
          return game
            ? Promise.reject("Game already exists")
            : Promise.resolve();
        },
      },
    },
    time_of_creation: {
      in: ["body"],
      trim: true,
      isInt: {
        options: {
          min: min_time_of_creation,
          max: max_time_of_creation,
        },
        errorMessage: `Time of Creation must be between ${min_time_of_creation} and ${max_time_of_creation}`,
      },
      escape: true,
    },
  }),
  asyncHandler(async (req, res, next) => {
    if (!isValidObjectId(req.params.id)) {
      const err = new Error("Invalid Game ID");
      err.status = 404;
      return next(err);
    }

    const errors = validationResult(req);
    if (
      !errors.isEmpty() &&
      (errors.array().length > 1 ||
        !errors.mapped().name ||
        errors.mapped().name.value !== req.body.prev_name)
    ) {
      res.render("game_form", {
        title: "Update Game",
        game: req.body,
        prev_name: req.body.prev_name,
        min_time_of_creation,
        max_time_of_creation,
        errors: new Map(errors.array().map((error) => [error.path, error.msg])),
      });
      return;
    }

    const game = new Game({
      _id: req.params.id,
      name: req.body.name,
      time_of_creation: req.body.time_of_creation,
    });
    await Game.findByIdAndUpdate(req.params.id, game).exec();
    res.redirect(game.url);
  }),
];
