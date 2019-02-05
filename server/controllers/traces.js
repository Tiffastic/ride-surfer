const Trace = require("../models").Trace;
const sequelize = require("../models").sequelize;

module.exports = {
  retrieveAll(req, res) {
    return Trace.findAll()
      .then(traces => {
        if (!traces) {
          return res.status(404).json({
            message: "Traces Not Found"
          });
        }
        return res.status(200).json(traces);
      })
      .catch(error => res.status(400).json(error));
  },
  create(req, res) {
    var loc = {
      type: "Point",
      coordinates: req.body.location,
      crs: { type: "name", properties: { name: "EPSG:4326" } }
    };
    return Trace.create({
      journeyId: req.body.journeyId,
      location: loc,
      timestamp: sequelize.fn("NOW")
    })
      .then(trace => res.status(201).json(trace))
      .catch(error => res.status(400).json(error));
  },

  retrieve(req, res) {
    return Trace.find({
      where: {
        journeyId: req.body.journeyId,
        userId: req.body.userId
      },
      include: [
        {
          model: Journey,
          where: { journeyId: Sequelize.col("Journey.id") }
        }
      ]
    })
      .then(trace => {
        if (!trace) {
          return res.status(404).json({
            message: "Trace Not Found"
          });
        }
        return res.status(200).json(trace);
      })
      .catch(error => res.status(400).json(trace));
  }
};
