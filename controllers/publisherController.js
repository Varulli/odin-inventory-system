const debug = require("debug")("odin-inventory-system:publisherController");

const Publisher = require("../models/publisher");
const Game = require("../models/game");

const asyncHandler = require("express-async-handler");
const { isValidObjectId } = require("mongoose");
const { checkSchema, validationResult } = require("express-validator");

const min_time_of_creation =
  Publisher.schema.path("time_of_creation").options.min;
const max_time_of_creation =
  Publisher.schema.path("time_of_creation").options.max;

// Display list of all Publishers.
exports.publisher_list = asyncHandler(async (req, res, next) => {
  const publishers = await Publisher.find({}, { name: 1 })
    .sort({ name: 1 })
    .exec();
  res.render("publisher_list", {
    title: "List of Publishers",
    publisher_list: publishers,
  });
});

// Display detail page for a specific Publisher.
exports.publisher_detail = asyncHandler(async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    const err = new Error("Invalid Publisher ID");
    err.status = 404;
    return next(err);
  }

  const [publisher, publisher_games] = await Promise.all([
    Publisher.findById(req.params.id).exec(),
    Game.find({ publisher: req.params.id }, { name: 1, description: 1 })
      .sort({ name: 1 })
      .exec(),
  ]);
  res.render("publisher_detail", {
    title: `Publisher: ${publisher.name}`,
    publisher,
    publisher_games,
  });
});

// Display Publisher create form on GET.
exports.publisher_create_get = asyncHandler(async (req, res, next) => {
  res.render("publisher_form", {
    title: "Create Publisher",
    min_time_of_creation,
    max_time_of_creation,
  });
});

// Handle Publisher create on POST.
exports.publisher_create_post = [
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
          const publisher = await Publisher.findOne({ name: value }).exec();
          return publisher
            ? Promise.reject("Publisher already exists")
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
      res.render("publisher_form", {
        title: "Create Publisher",
        publisher: req.body,
        min_time_of_creation,
        max_time_of_creation,
        errors: new Map(errors.array().map((error) => [error.path, error.msg])),
      });
      return;
    }

    const publisher = new Publisher({
      name: req.body.name,
      time_of_creation: req.body.time_of_creation,
    });
    await publisher.save();
    res.redirect(publisher.url);
  }),
];

// Display Publisher delete form on GET.
exports.publisher_delete_get = asyncHandler(async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    const err = new Error("Invalid Publisher ID");
    err.status = 404;
    return next(err);
  }

  const [publisher, publisher_games] = await Promise.all([
    Publisher.findById(req.params.id).exec(),
    Game.find({ publisher: req.params.id }, { name: 1, description: 1 })
      .sort({ name: 1 })
      .exec(),
  ]);
  res.render("publisher_delete", {
    title: `Delete Publisher: ${publisher.name}`,
    publisher,
    publisher_games,
  });
});

// Handle Publisher delete on POST.
exports.publisher_delete_post = asyncHandler(async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    const err = new Error("Invalid Publisher ID");
    err.status = 404;
    return next(err);
  }

  await Promise.all([
    Game.updateMany(
      { publisher: req.params.id },
      { $unset: { publisher: "" } }
    ).exec(),
    Publisher.findByIdAndDelete(req.params.id).exec(),
  ]);
  res.redirect("/inventory/publishers");
});

// Display Publisher update form on GET.
exports.publisher_update_get = asyncHandler(async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    const err = new Error("Invalid Publisher ID");
    err.status = 404;
    return next(err);
  }

  const publisher = await Publisher.findById(req.params.id).exec();
  res.render("publisher_form", {
    title: "Update Publisher",
    publisher,
    prev_name: publisher.name,
    min_time_of_creation,
    max_time_of_creation,
  });
});

// Handle Publisher update on POST.
exports.publisher_update_post = [
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
          const publisher = await Publisher.findOne({ name: value }).exec();
          return publisher
            ? Promise.reject("Publisher already exists")
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
      const err = new Error("Invalid Publisher ID");
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
      res.render("publisher_form", {
        title: "Update Publisher",
        publisher: req.body,
        prev_name: req.body.prev_name,
        min_time_of_creation,
        max_time_of_creation,
        errors: new Map(errors.array().map((error) => [error.path, error.msg])),
      });
      return;
    }

    const publisher = new Publisher({
      _id: req.params.id,
      name: req.body.name,
      time_of_creation: req.body.time_of_creation,
    });
    await Publisher.findByIdAndUpdate(req.params.id, publisher).exec();
    res.redirect(publisher.url);
  }),
];
