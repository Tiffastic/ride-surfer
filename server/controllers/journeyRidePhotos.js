const Journey = require("../models").Journey;
const Bios = require("../models").Bios;

const PassengerRide = require("../models").PassengerRide;
const User = require("../models").User;

module.exports = {
  getDriverPhotos(req, res) {
    const userIds = [];
    const images = {};
    var i = 0;

    PassengerRide.findAll({
      include: [
        {
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
          userIds.push(ride.driverJourney.User.id);
        });
      })
      .then(() => {
        userIds.map(id => {
          Bios.findOne({
            where: { userId: id }
          }).then(bio => {
            images[id.toString()] = bio.image;

            i++;
            if (i >= userIds.length) {
              res.status(200).send(images);
            }
          });
        });
      });
  },

  getPassengerPhotos(req, res) {
    const userIds = [];
    const images = {};
    var i = 0;

    PassengerRide.findAll({
      include: [
        {
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
          userIds.push(ride.passengerJourney.User.id);
        });
      })
      .then(() => {
        userIds.map(id => {
          Bios.findOne({
            where: { userId: id }
          }).then(bio => {
            images[id.toString()] = bio.image;

            i++;
            if (i >= userIds.length) {
              res.status(200).send(images);
            }
          });
        });
      });
  }
};
