const PassengerRide = require("../models").PassengerRide;
const Journey = require("../models").Journey;
const User = require("../models").User;
const Vehicle = require("../models").Vehicle;
const sequelize = require("../models").sequelize;
const Sequelize = require("../models").Sequelize;

module.exports = {
  create(req, res) {
    return PassengerRide.create(req.body, { fields: Object.keys(req.body) })
      .then(passengerRide => res.status(201).json(passengerRide))
      .catch(error => res.status(400).json(error));
  },

  retrieveAll(req, res) {
    return PassengerRide.findAll()
      .then(passengerRide => {
        if (!passengerRide) {
          return res.status(404).json({
            message: "Ride Not Found"
          });
        }
        return res.status(200).json(passengerRide);
      })
      .catch(error => res.status(400).json(error));
  },
  retrieveDrivingRides(req, res) {
    return PassengerRide.findAll({
      include: [
        {
          model: Journey,
          as: "driverJourney",
          attributes: ["id", "userId", "origin", "destination", "arrivalAt"],
          where: { userId: req.params.id },
          include: [User]
        },
        {
          model: Journey,
          as: "passengerJourney",
          attributes: ["id", "userId", "origin", "destination", "arrivalAt"],
          include: [
            {
              model: User,
              include: [
                {
                  model: Vehicle,
                  as: "vehicles",
                  attributes: ["id", "year", "make", "model", "plate"]
                }
              ]
            }
          ]
        }
      ]
    })
      .then(driverRide => {
        if (!driverRide) {
          return res.status(404).json({
            message: "Ride Not Found"
          });
        }
        return res.status(200).json(driverRide);
      })
      .catch(error => res.status(400).json(error));
  },

  retrievePassengerRides(req, res) {
    return PassengerRide.findAll({
      include: [
        {
          model: Journey,
          as: "driverJourney",
          attributes: ["id", "userId", "origin", "destination", "arrivalAt"],
          include: [
            {
              model: User,
              include: [
                {
                  model: Vehicle,
                  as: "vehicles",
                  attributes: ["id", "year", "make", "model", "plate"]
                }
              ]
            }
          ]
        },
        {
          model: Journey,
          as: "passengerJourney",
          attributes: ["id", "userId", "origin", "destination", "arrivalAt"],
          where: { userId: req.params.id },
          include: [User]
        }
      ]
    })
      .then(passengerRide => {
        if (!passengerRide) {
          return res.status(404).json({
            message: "Ride Not Found"
          });
        }
        return res.status(200).json(passengerRide);
      })
      .catch(error => res.status(400).json(error));
  },

  destroy(req, res) {
    return PassengerRide.findByPk(req.params.id)
      .then(passengerRide => {
        if (!passengerRide) {
          return res.status(400).json({
            message: "Ride Not Found"
          });
        }
        return passengerRide
          .destroy()
          .then(() => res.status(204).json())
          .catch(error => res.status(400).json(error));
      })
      .catch(error => res.status(400).json(error));
  },

  update(req, res) {
    return PassengerRide.find({
      where: {
        id: req.params.id
      }
    })
      .then(passengerRide => {
        if (!passengerRide) {
          return res.status(404).json({
            message: "Ride Not Found"
          });
        }

        return passengerRide
          .update(req.body, { fields: Object.keys(req.body) })
          .then(updatedRide => res.status(200).json(updatedRide))
          .catch(error => res.status(400).json(error));
      })
      .catch(error => res.status(400).json(error));
  }
};
