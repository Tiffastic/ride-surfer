const Journey = require("../models").Journey;
const sequelize = require("../models").sequelize;

module.exports = {
  create(req, res) {
    var origin = {
      type: "Point",
      coordinates: req.body.origin
    };

    var destination = {
      type: "Point",
      coordinates: req.body.destination
    };

    return Journey.create({
      userID: req.body.userID,
      origin: origin,
      destination: destination,
      arrivalAt: req.body.arrivalAt
    })
      .then(journey => res.status(201).json(journey))
      .catch(error => res.status(400).json(error));
  },

  retrieve(req, res) {
    return Journey.findByPk(req.params.id)
      .then(journey => {
        if (!journey) {
          return res.status(404).json({
            message: "Journey Not Found"
          });
        }
        return res.status(200).json(journey);
      })
      .catch(error => res.status(400).json(journey));
  },

  update(req, res) {
    return Journey.find({
      where: {
        id: req.params.id
      }
    })
      .then(journey => {
        if (!journey) {
          return res.status(404).json({
            message: "Journey Not Found"
          });
        }

        return journey
          .update(req.body, { fields: Object.keys(req.body) })
          .then(updatedJourney => res.status(200).json(updatedJourney))
          .catch(error => res.status(400).json(error));
      })
      .catch(error => res.status(400).json(error));
  }
};
