const RateRides = require("../models").RateRides;

module.exports = {
  calculateAvgOverallRating(req, res) {
    RateRides.findAll({
      where: {
        personRatedId: req.params.id
      }
    }).then(rateRides => {
      var overallSum = 0.0;
      var count = 0.0;

      rateRides.forEach(rateRide => {
        overallSum += rateRide.overall;
        count++;
      });

      var avgOverall = overallSum / count;
      console.log("ENDPOINT. avgOverall = " + avgOverall);
      console.log("ENDPOINT. overallSum = " + overallSum);
      console.log("ENDPOINT. count =  " + count);
      return res
        .status(200)
        .json({ personRatedId: req.params.id, avgOverall: avgOverall });
    });
  },

  calculateAvgCleanlinessRating(req, res) {
    RateRides.findAll({
      where: {
        personRatedId: req.params.id
      }
    }).then(rateRides => {
      var cleanlinessSum = 0.0;
      var count = 0.0;

      rateRides.forEach(rateRide => {
        cleanlinessSum += rateRide.cleanliness;
        count++;
      });

      var avgCleanliness = cleanlinessSum / count;
      return res
        .status(200)
        .json({ personRatedId: req.params.id, avgCleanliness: avgCleanliness });
    });
  },

  calculateAvgSafetyRating(req, res) {
    RateRides.findAll({
      where: {
        personRatedId: req.params.id
      }
    }).then(rateRides => {
      var safetySum = 0.0;
      var count = 0.0;

      rateRides.forEach(rateRide => {
        safetySum += rateRide.safety;
        count++;
      });

      var avgSafety = safetySum / count;
      return res
        .status(200)
        .json({ personRatedId: req.params.id, avgSafety: avgSafety });
    });
  },

  calculateAvgTimelinessRating(req, res) {
    RateRides.findAll({
      where: {
        personRatedId: req.params.id
      }
    }).then(rateRides => {
      var timelinessSum = 0.0;
      var count = 0.0;

      rateRides.forEach(rateRide => {
        timelinessSum += rateRide.timeliness;
        count++;
      });

      var avgTimeliness = timelinessSum / count;
      return res
        .status(200)
        .json({ personRatedId: req.params.id, avgTimeliness: avgTimeliness });
    });
  }
};
