const Trace = require("../models").Trace;

module.exports = {
  create(req, res) {
    return Trace.create(req.body, { fields: Object.keys(req.body) })
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
