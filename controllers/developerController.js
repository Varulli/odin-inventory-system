const debug = require("debug")("odin-inventory-system:developerController");

const Developer = require("../models/developer");
const Game = require("../models/game");

const asyncHandler = require("express-async-handler");
const { isValidObjectId } = require("mongoose");
const { checkSchema, validationResult } = require("express-validator");
const developer = require("../models/developer");

const min_time_of_creation =
  Developer.schema.path("time_of_creation").options.min;
const max_time_of_creation =
  Developer.schema.path("time_of_creation").options.max;
const types = Developer.schema.path("type").enumValues;

// Display list of all Developers.
exports.developer_list = asyncHandler(async (req, res, next) => {
  const developers = await Developer.find({}, { name: 1 })
    .sort({ name: 1 })
    .exec();
  res.render("developer_list", {
    title: "List of Developers",
    developer_list: developers,
  });
});

// Display detail page for a specific Developer.
exports.developer_detail = asyncHandler(async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    const err = new Error("Invalid Developer ID");
    err.status = 404;
    return next(err);
  }

  const [developer, developer_games] = await Promise.all([
    Developer.findById(req.params.id).exec(),
    Game.find({ developer: req.params.id }, { name: 1, description: 1 }).exec(),
  ]);
  res.render("developer_detail", {
    title: `Developer: ${developer.name}`,
    developer,
    developer_games,
  });
});

// Display Developer create form on GET.
exports.developer_create_get = asyncHandler(async (req, res, next) => {
  res.render("developer_form", {
    title: "Create Developer",
    min_time_of_creation,
    max_time_of_creation,
    types,
  });
});

// Handle Developer create on POST.
exports.developer_create_post = [
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
          const developer = await Developer.findOne({ name: value }).exec();
          return developer
            ? Promise.reject("Developer already exists")
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
    type: {
      in: ["body"],
      trim: true,
      isIn: {
        options: [types],
        errorMessage: `Type must be one of: ${Developer.schema
          .path("type")
          .enumValues.join(", ")}`,
      },
      escape: true,
    },
  }),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("developer_form", {
        title: "Create Developer",
        developer: req.body,
        min_time_of_creation,
        max_time_of_creation,
        types,
        errors: new Map(errors.array().map((error) => [error.path, error.msg])),
      });
      return;
    }

    const developer_details = {
      name: req.body.name,
      type: req.body.type,
    };
    if (req.body.time_of_creation) {
      developer_details.time_of_creation = req.body.time_of_creation;
    }

    const developer = new Developer(developer_details);
    await developer.save();
    res.redirect(developer.url);
  }),
];

// Display Developer delete form on GET.
exports.developer_delete_get = asyncHandler(async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    const err = new Error("Invalid Developer ID");
    err.status = 404;
    return next(err);
  }

  const [developer, developer_games] = await Promise.all([
    Developer.findById(req.params.id).exec(),
    Game.find({ developer: req.params.id }, { name: 1, description: 1 })
      .sort({ name: 1 })
      .exec(),
  ]);
  res.render("developer_delete", {
    title: `Delete Developer: ${developer.name}`,
    developer,
    developer_games,
  });
});

// Handle Developer delete on POST.
exports.developer_delete_post = asyncHandler(async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    const err = new Error("Invalid Developer ID");
    err.status = 404;
    return next(err);
  }

  await Promise.all([
    Game.updateMany(
      { developer: req.params.id },
      { $unset: { developer: "" } }
    ).exec(),
    Developer.findByIdAndDelete(req.params.id).exec(),
  ]);
  res.redirect("/inventory/developers");
});

// Display Developer update form on GET.
exports.developer_update_get = asyncHandler(async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    const err = new Error("Invalid Developer ID");
    err.status = 404;
    return next(err);
  }

  const developer = await Developer.findById(req.params.id).exec();
  res.render("developer_form", {
    title: "Update Developer",
    developer,
    prev_name: developer.name,
    min_time_of_creation,
    max_time_of_creation,
    types,
  });
});

// Handle Developer update on POST.
exports.developer_update_post = [
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
          const developer = await Developer.findOne({ name: value }).exec();
          return developer
            ? Promise.reject("Developer already exists")
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
    type: {
      in: ["body"],
      trim: true,
      isIn: {
        options: [types],
        errorMessage: `Type must be one of: ${types.join(", ")}`,
      },
      escape: true,
    },
  }),
  asyncHandler(async (req, res, next) => {
    if (!isValidObjectId(req.params.id)) {
      const err = new Error("Invalid Developer ID");
      err.status = 404;
      return next(err);
    }

    const errors = validationResult(req)
      .array()
      .filter(
        (error) => error.path !== "name" || error.value !== req.body.prev_name
      );
    if (errors.length > 0) {
      res.render("developer_form", {
        title: "Update Developer",
        developer: req.body,
        prev_name: req.body.prev_name,
        min_time_of_creation,
        max_time_of_creation,
        types,
        errors: new Map(errors.map((error) => [error.path, error.msg])),
      });
      return;
    }

    const developer_details = {
      _id: req.params.id,
      name: req.body.name,
      type: req.body.type,
    };
    if (req.body.time_of_creation) {
      developer_details.time_of_creation = req.body.time_of_creation;
    }

    const developer = new Developer(developer_details);
    await Developer.findByIdAndUpdate(req.params.id, developer).exec();
    res.redirect(developer.url);
  }),
];
