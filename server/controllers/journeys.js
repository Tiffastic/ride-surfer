const Journey = require("../models").Journey;
const User = require("../models").User;

module.exports = {
  retrieveAll(req, res) {
    return Journey.findAll()
      .then(journeys => {
        if (!journeys) {
          return res.status(404).json({
            message: "Journeys Not Found"
          });
        }
        return res.status(200).json(journeys);
      })
      .catch(error => res.status(400).json(error));
  },

  retrieveMatches(req, res) {
    return Journey.findAll({ /*where: { isDriver: true },*/ include: [User] })
      .then(journeys => {
        if (!journeys) {
          return res.status(404).json({
            message: "Journeys Not Found"
          });
        }
        return res.status(200).json(journeys);
      })
      .catch(error => res.status(400).json(error));
  },

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
      userId: req.body.userId,
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
