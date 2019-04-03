var express = require("express"),
  favicon = require("serve-favicon"),
  logger = require("morgan"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  errorHandler = require("errorhandler"),
  http = require("http"),
  path = require("path");
compression = require("compression");
module.exports = (function() {
  var app = express();

  // all environments
  app.set("port", process.env.PORT || 3000);
  app.set("views", path.join(__dirname, "views"));
  app.set("view engine", "pug");
  app.use(favicon("public/images/punch.png"));
  app.use(logger("dev"));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(methodOverride());
  app.use(express.static(path.join(__dirname, "public")));

  // compress all responses
  app.use(compression());
  app.use(errorHandler());

  return app;
})();
