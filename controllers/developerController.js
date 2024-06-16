const debug = require("debug")("odin-inventory-system:developerController");

const Developer = require("../models/developer");

// Display list of all Developers.
exports.developer_list = function (req, res) {
  res.send("NOT IMPLEMENTED: Developer list");
};

// Display detail page for a specific Developer.
exports.developer_detail = function (req, res) {
  res.send("NOT IMPLEMENTED: Developer detail: " + req.params.id);
};

// Display Developer create form on GET.
exports.developer_create_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Developer create GET");
};

// Handle Developer create on POST.
exports.developer_create_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Developer create POST");
};

// Display Developer delete form on GET.
exports.developer_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Developer delete GET");
};

// Handle Developer delete on POST.
exports.developer_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Developer delete POST");
};

// Display Developer update form on GET.
exports.developer_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: Developer update GET");
};

// Handle Developer update on POST.
exports.developer_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: Developer update POST");
};
