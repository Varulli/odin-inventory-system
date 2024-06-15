const express = require("express");
const router = express.Router();

// Require controller modules.

// GET inventory home page.
router.get("/", function (req, res) {
  res.render("index", { title: "Exotic Animal Emporium" });
});

module.exports = router;
