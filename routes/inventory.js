const express = require("express");
const router = express.Router();

// Require controller modules.
const gameController = require("../controllers/gameController");
const genreController = require("../controllers/genreController");
const platformController = require("../controllers/platformController");
const developerController = require("../controllers/developerController");
const publisherController = require("../controllers/publisherController");

// GET inventory home page.
router.get("/", function (req, res) {
  res.render("index", { title: "Videogame Inventory" });
});

// GAME ROUTES //

// GET request for creating a Game.
router.get("/game/create", gameController.game_create_get);

// POST request for creating Game.
router.post("/game/create", gameController.game_create_post);

// GET request to delete Game.
router.get("/game/:id/*/delete", gameController.game_delete_get);

// POST request to delete Game.
router.post("/game/:id/*/delete", gameController.game_delete_post);

// GET request to update Game.
router.get("/game/:id/*/update", gameController.game_update_get);

// POST request to update Game.
router.post("/game/:id/*/update", gameController.game_update_post);

// GET request for one Game.
router.get("/game/:id/*", gameController.game_detail);

// GET request for list of all Game items.
router.get("/games", gameController.game_list);

// GENRE ROUTES //

// GET request for creating Genre.
router.get("/genre/create", genreController.genre_create_get);

// POST request for creating Genre.
router.post("/genre/create", genreController.genre_create_post);

// GET request to delete Genre.
router.get("/genre/:name/delete", genreController.genre_delete_get);

// POST request to delete Genre.
router.post("/genre/:name/delete", genreController.genre_delete_post);

// GET request to update Genre.
router.get("/genre/:name/update", genreController.genre_update_get);

// POST request to update Genre.
router.post("/genre/:name/update", genreController.genre_update_post);

// GET request for one Genre.
router.get("/genre/:name", genreController.genre_detail);

// GET request for list of all Genre items.
router.get("/genres", genreController.genre_list);

// PLATFORM ROUTES //

// GET request for creating Platform.
router.get("/platform/create", platformController.platform_create_get);

// POST request for creating Platform.
router.post("/platform/create", platformController.platform_create_post);

// GET request to delete Platform.
router.get("/platform/:name/delete", platformController.platform_delete_get);

// POST request to delete Platform.
router.post("/platform/:name/delete", platformController.platform_delete_post);

// GET request to update Platform.
router.get("/platform/:name/update", platformController.platform_update_get);

// POST request to update Platform.
router.post("/platform/:name/update", platformController.platform_update_post);

// GET request for one Platform.
router.get("/platform/:name", platformController.platform_detail);

// GET request for list of all Platform items.
router.get("/platforms", platformController.platform_list);

// DEVELOPER ROUTES //

// GET request for creating Developer.
router.get("/developer/create", developerController.developer_create_get);

// POST request for creating Developer.
router.post("/developer/create", developerController.developer_create_post);

// GET request to delete Developer.
router.get("/developer/:name/delete", developerController.developer_delete_get);

// POST request to delete Developer.
router.post(
  "/developer/:name/delete",
  developerController.developer_delete_post
);

// GET request to update Developer.
router.get("/developer/:name/update", developerController.developer_update_get);

// POST request to update Developer.
router.post(
  "/developer/:name/update",
  developerController.developer_update_post
);

// GET request for one Developer.
router.get("/developer/:name", developerController.developer_detail);

// GET request for list of all Developer items.
router.get("/developers", developerController.developer_list);

// PUBLISHER ROUTES //

// GET request for creating Publisher.
router.get("/publisher/create", publisherController.publisher_create_get);

// POST request for creating Publisher.
router.post("/publisher/create", publisherController.publisher_create_post);

// GET request to delete Publisher.
router.get("/publisher/:name/delete", publisherController.publisher_delete_get);

// POST request to delete Publisher.
router.post(
  "/publisher/:name/delete",
  publisherController.publisher_delete_post
);

// GET request to update Publisher.
router.get("/publisher/:name/update", publisherController.publisher_update_get);

// POST request to update Publisher.
router.post(
  "/publisher/:name/update",
  publisherController.publisher_update_post
);

// GET request for one Publisher.
router.get("/publisher/:name", publisherController.publisher_detail);

// GET request for list of all Publisher items.
router.get("/publishers", publisherController.publisher_list);

module.exports = router;
