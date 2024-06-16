const debug = require("debug")("odin-inventory-system:publisherController");

const Publisher = require("../models/publisher");

// Display list of all Publishers.
exports.publisher_list = function (req, res) {
  res.send("NOT IMPLEMENTED: Publisher list");
};

// Display detail page for a specific Publisher.
exports.publisher_detail = function (req, res) {
  res.send("NOT IMPLEMENTED: Publisher detail: " + req.params.id);
};

// Display Publisher create form on GET.
exports.publisher_create_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Publisher create GET");
};

// Handle Publisher create on POST.
exports.publisher_create_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Publisher create POST");
};

// Display Publisher delete form on GET.
exports.publisher_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Publisher delete GET");
};

// Handle Publisher delete on POST.
exports.publisher_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Publisher delete POST");
};

// Display Publisher update form on GET.
exports.publisher_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Publisher update GET");
};

// Handle Publisher update on POST.
exports.publisher_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Publisher update POST");
};
