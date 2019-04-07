const users = require("./users");
const vehicles = require("./vehicles");
const journeys = require("./journeys");
const traces = require("./traces");
const pushNotifications = require("./pushNotifications");
const passengerRides = require("./passengerRides");
const calculateRatings = require("./calculateRatings");
const bios = require("./bios");
const journeyRidesPhotos = require("./journeyRidePhotos");
const messagechats = require("./messagechat");
const forgotPassword = require("./forgotPassword");

module.exports = {
  users,
  vehicles,
  journeys,
  traces,
  pushNotifications,
  passengerRides,
  calculateRatings,
  bios,
  journeyRidesPhotos,
  messagechats,
  forgotPassword
};
