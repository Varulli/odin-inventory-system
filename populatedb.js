#! usr/env/bin node

console.log(
  'This script populates some test games, genres, developers, and publishers to the database. Specified database as argument - e.g.: node populatedb "mongodb+srv://<username>:<password>@cluster0.cg2uxt1.mongodb.net/inventory?retryWrites=true&w=majority&appName=Cluster0"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Game = require("./models/game");
const Genre = require("./models/genre");
const Developer = require("./models/developer");
const Publisher = require("./models/publisher");

const games = [];
const genres = [];
const developers = [];
const publishers = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createGenres();
  await createDevelopers();
  await createPublishers();
  await createGames();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function genreCreate(index, name) {
  const genre = new Genre({ name: name });
  await genre.save();
  genres[index] = genre;
  console.log(`Added genre: ${name}`);
}

async function developerCreate(index, name, time_of_creation, type) {
  const developerDetails = {
    name: name,
    type: type,
  };
  if (time_of_creation) developerDetails.time_of_creation = time_of_creation;

  const developer = new Developer(developerDetails);

  await developer.save();
  developers[index] = developer;
  console.log(`Added developer: ${name}`);
}

async function publisherCreate(index, name, time_of_creation) {
  const publisherDetails = { name: name };
  if (time_of_creation) publisherDetails.time_of_creation = time_of_creation;

  const publisher = new Publisher(publisherDetails);
  await publisher.save();
  publishers[index] = publisher;
  console.log(`Added publisher: ${name}`);
}

async function gameCreate(
  index,
  name,
  time_of_creation,
  description,
  genre,
  developer,
  publisher
) {
  const gameDetails = { name: name };
  if (time_of_creation) gameDetails.time_of_creation = time_of_creation;
  if (description) gameDetails.description = description;
  if (genre) gameDetails.genre = genre;
  if (developer) gameDetails.developer = developer;
  if (publisher) gameDetails.publisher = publisher;

  const game = new Game(gameDetails);
  await game.save();
  games[index] = game;
  console.log(`Added game: ${name}`);
}

async function createGenres() {
  console.log("Removing existing genres");
  await Genre.deleteMany({});

  console.log("Adding genres");
  await Promise.all([
    genreCreate(0, "Action"),
    genreCreate(1, "Adventure"),
    genreCreate(2, "Role-Playing Game (RPG)"),
    genreCreate(3, "Third-Person Shooter"),
    genreCreate(4, "Turn-Based Strategy"),
  ]);
}

async function createDevelopers() {
  console.log("Removing existing developers");
  await Developer.deleteMany({});

  console.log("Adding developers");
  await Promise.all([
    developerCreate(0, "CD Projekt Red", 2002, "Studio"),
    developerCreate(1, "Bethesda Game Studios", 2001, "Studio"),
    developerCreate(2, "FromSoftware", 1986, "Studio"),
    developerCreate(3, "Naughty Dog", 1984, "Studio"),
    developerCreate(4, "Mega Crit", undefined, "Indie"),
  ]);
}

async function createPublishers() {
  console.log("Removing existing publishers");
  await Publisher.deleteMany({});

  console.log("Adding publishers");
  await Promise.all([
    publisherCreate(0, "CD Projekt", 1994),
    publisherCreate(1, "Bethesda Softworks", 1986),
    publisherCreate(2, "FromSoftware", 1986),
    publisherCreate(3, "Sony Interactive Entertainment", 1993),
    publisherCreate(4, "Humble Bundle", 2010),
  ]);
}

async function createGames() {
  console.log("Removing existing games");
  await Game.deleteMany({});

  console.log("Adding games");
  await Promise.all([
    gameCreate(
      0,
      "The Witcher 3: Wild Hunt",
      2015,
      "The Witcher 3: Wild Hunt is a 2015 action role-playing game developed and published by CD Projekt.",
      genres.slice(0, 3),
      developers[0],
      publishers[0]
    ),
    gameCreate(
      1,
      "The Elder Scrolls V: Skyrim",
      2011,
      "The Elder Scrolls V: Skyrim is a 2011 action role-playing game developed by Bethesda Game Studios and published by Bethesda Softworks.",
      genres.slice(0, 3),
      developers[1],
      publishers[1]
    ),
    gameCreate(
      2,
      "Dark Souls",
      2011,
      "Dark Souls is a 2011 action role-playing game developed by FromSoftware and published by FromSoftware.",
      [genres[0], genres[2]],
      developers[2],
      publishers[2]
    ),
    gameCreate(
      3,
      "Uncharted 4: A Thief's End",
      2016,
      "Uncharted 4: A Thief's End is a 2016 action-adventure game developed by Naughty Dog and published by Sony Interactive Entertainment.",
      [genres[0], genres[1], genres[3]],
      developers[3],
      publishers[3]
    ),
    gameCreate(
      4,
      "Slay the Spire",
      2017,
      "Slay the Spire is a 2017 roguelike deck-building game developed by Mega Crit and published by Humble Bundle.",
      [genres[4]],
      developers[4],
      publishers[4]
    ),
  ]);
}
