const Journey = require("../models").Journey;
const Bios = require("../models").Bios;

const PassengerRide = require("../models").PassengerRide;
const User = require("../models").User;

module.exports = {
  getMyPassengersPhotos(req, res) {
    const userIds = [];
    const images = {};
    var i = 0;

    PassengerRide.findAll({
      include: [
        {
          // Get all the journeys for which I am the driver
          model: Journey,
          as: "driverJourney",
          attributes: ["id", "userId", "origin", "destination", "arrivalAt"],
          where: { userId: req.params.userId },
          include: [User]
        },
        {
          model: Journey,
          as: "passengerJourney",
          attributes: ["id", "userId", "origin", "destination", "arrivalAt"],
          include: [User]
        }
      ]
    })
      .then(driverRide => {
        driverRide.map(ride => {
          userIds.push(ride.passengerJourney.User.id);
        });
      })
      .then(() => {
        userIds.map(id => {
          Bios.findOne({
            where: { userId: id }
          }).then(bio => {
            images[id.toString()] = bio.image;

            // asynchronous programming causes send to happen before foreach loop finishes.
            //So we have to control sending response with this if statement.
            i++;
            if (i >= userIds.length) {
              res.status(200).send(images);
            }
          });
        });
      });
  },

  getMyDriversPhotos(req, res) {
    const userIds = [];
    const images = {};
    var i = 0;

    PassengerRide.findAll({
      include: [
        {
          // Get all the journeys for which I am the passenger
          model: Journey,
          as: "driverJourney",
          attributes: ["id", "userId", "origin", "destination", "arrivalAt"],
          include: [User]
        },
        {
          model: Journey,
          as: "passengerJourney",
          attributes: ["id", "userId", "origin", "destination", "arrivalAt"],
          where: { userId: req.params.userId },
          include: [User]
        }
      ]
    })
      .then(passengerRide => {
        passengerRide.map(ride => {
          userIds.push(ride.driverJourney.User.id);
        });
      })
      .then(() => {
        userIds.map(id => {
          Bios.findOne({
            where: { userId: id }
          }).then(bio => {
            images[id.toString()] = bio.image;

            // asynchronous programming causes send to happen before foreach loop is done, so we have to control when
            // the send happens with this if statement
            i++;
            if (i >= userIds.length) {
              res.status(200).send(images);
            }
          });
        });
      });
  }
};
