const usersController = require("../controllers").users;
const journeysController = require("../controllers").journeys;
const tracesController = require("../controllers").traces;
const passengerRideController = require("../controllers").passengerRides;
const RateRide = require("../models").RateRides;

module.exports = app => {
  app.get("/api", (req, res) =>
    res.status(200).send({
      message: "Welcome to the Ride Surfer API!"
    })
  );

  app.get("/users/", usersController.retrieveAll);
  app.get("/users/:id", usersController.retrieve);
  app.post("/users", usersController.create);
  app.post("/users/login", usersController.retrieveByLoginInfo);
  app.put("/users/:id", usersController.update);
  app.delete("/users/:id", usersController.destroy);

  app.all("/users/:id/items", (req, res) =>
    res.status(405).send({
      message: "Method Not Allowed"
    })
  );

  app.get("/journeys", journeysController.retrieveAll);
  app.get("/journeys/matches", journeysController.retrieveMatches);
  app.get("/journeys/:id", journeysController.retrieve);
  app.post("/journeys", journeysController.create);
  app.put("/journeys/:id", journeysController.update);

  app.get("/traces", tracesController.retrieveAll);
  app.get("/traces/:id", tracesController.retrieve);
  app.post("/traces", tracesController.create);

  app.get("/passengerRides", passengerRideController.retrieveAll);
  app.get(
    "/passengerRides/drive/:id",
    passengerRideController.retrieveDrivingRides
  );
  app.get(
    "/passengerRides/passenger/:id",
    passengerRideController.retrievePassengerRides
  );
  app.post("/passengerRides", passengerRideController.create);
  app.put("/passengerRides/:id", passengerRideController.update);
  app.delete("/passengerRides/:id", passengerRideController.destroy);

  const RateRide = require("../models").RateRides;
  app.post("/rateride", (req, res, next) => {
    RateRide.create(req.body, { fields: Object.keys(req.body) })
      .then(rating => res.status(201).json(rating))
      .catch(error => res.status(400).json(error));
  });
};
