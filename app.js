require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const compression = require("compression");
const RateLimit = require("express-rate-limit");
const helmet = require("helmet");

// database connection setup
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const uri = process.env.MONGODB_URI || process.env.DEV_MONGODB_URI;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(uri);
}

var indexRouter = require("./routes/index");
const inventoryRouter = require("./routes/inventory");

var app = express();

// rate limiter setup
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per windowMs
});
app.use(limiter);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'"],
    },
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(compression());

app.use("/", indexRouter);
app.use("/inventory", inventoryRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
