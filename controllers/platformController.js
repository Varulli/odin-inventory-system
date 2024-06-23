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
exports.platform_detail = asyncHandler(async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    const err = new Error("Invalid Platform ID");
    err.status = 404;
    return next(err);
  }

  const [platform, platform_games] = await Promise.all([
    Platform.findById(req.params.id).exec(),
    Game.find({ platform: req.params.id }, { name: 1, description: 1 }).exec(),
  ]);
  res.render("platform_detail", {
    title: `Platform: ${platform.name}`,
    platform,
    platform_games,
  });
});

// Display Platform create form on GET.
exports.platform_create_get = asyncHandler(async (req, res, next) => {
  res.render("platform_form", { title: "Create Platform" });
});

// Handle Platform create on POST.
exports.platform_create_post = [
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
          const platform = await Platform.findOne({ name: value }).exec();
          return platform
            ? Promise.reject("Platform already exists")
            : Promise.resolve();
        },
      },
    },
  }),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("platform_form", {
        title: "Create Form",
        genre: req.body,
        errors: new Map(errors.array().map((error) => [error.path, error.msg])),
      });
      return;
    }

    const platform = new Platform({ name: req.body.name });
    await platform.save();
    res.redirect(platform.url);
  }),
];

// Display Platform delete form on GET.
exports.platform_delete_get = asyncHandler(async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    const err = new Error("Invalid Platform ID");
    err.status = 404;
    return next(err);
  }

  const [platform, platform_games] = await Promise.all([
    Platform.findById(req.params.id).exec(),
    Game.find({ platform: req.params.id }, { name: 1, description: 1 })
      .sort({ name: 1 })
      .exec(),
  ]);
  console.log(platform_games);
  res.render("platform_delete", {
    title: `Delete Platform: ${platform.name}`,
    platform,
    platform_games,
  });
});

// Handle Platform delete on POST.
exports.platform_delete_post = asyncHandler(async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    const err = new Error("Invalid Platform ID");
    err.status = 404;
    return next(err);
  }

  await Promise.all([
    Game.updateMany(
      { platform: req.params.id },
      { $pull: { platform: req.params.id } }
    ).exec(),
    Platform.findByIdAndDelete(req.params.id).exec(),
  ]);
  res.redirect("/inventory/platforms");
});

// Display Platform update form on GET.
exports.platform_update_get = asyncHandler(async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    const err = new Error("Invalid Platform ID");
    err.status = 404;
    return next(err);
  }

  const platform = await Platform.findById(req.params.id).exec();
  res.render("platform_form", {
    title: "Update Platform",
    platform,
    prev_name: platform.name,
  });
});

// Handle Platform update on POST.
exports.platform_update_post = [
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
          const platform = await Platform.findOne({ name: value }).exec();
          return platform
            ? Promise.reject("Platform already exists")
            : Promise.resolve();
        },
      },
    },
  }),
  asyncHandler(async (req, res, next) => {
    if (!isValidObjectId(req.params.id)) {
      const err = new Error("Invalid Platform ID");
      err.status = 404;
      return next(err);
    }

    const errors = validationResult(req)
      .array()
      .filter(
        (error) => error.path !== "name" || error.value !== req.body.prev_name
      );
    if (errors.length > 0) {
      res.render("platform_form", {
        title: "Update Platform",
        platform: req.body,
        prev_name: req.body.prev_name,
        errors: new Map(errors.map((error) => [error.path, error.msg])),
      });
      return;
    }

    const platform = new Platform({
      _id: req.params.id,
      name: req.body.name,
    });
    await Platform.findByIdAndUpdate(req.params.id, platform).exec();
    res.redirect(platform.url);
  }),
];
