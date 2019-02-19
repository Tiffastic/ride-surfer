const express = require("express");
const bodyParser = require("body-parser");

// Set up the express app
const app = express();

// Parse incoming requests data (https://github.com/expressjs/body-parser)

// MUST SET limit or else we cannot store the image file in the database
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// Setup a default catch-all route that sends back a welcome message in JSON format.
require("./server/routes")(app);
app.get("*", (req, res) =>
  res.status(200).send({
    message: "Welcome to the beginning of nothingness."
  })
);

module.exports = app;
