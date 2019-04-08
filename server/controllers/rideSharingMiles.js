const RideSharingMiles = require("../models").RideSharingMiles;

module.exports = {
  storeRideRequest(req, res) {
    RideSharingMiles.create(req.body, { fields: Object.keys(req.body) })
      .then(result => {
        res.status(201).json(result);
      })
      .catch(error => res.status(400).json(error));
  },

  finishRide(req, res) {
    var meId = req.query.meId;
    var passengerJourneyId = req.query.passengerJourneyId;
    var driverJourneyId = req.query.driverJourneyId;

    RideSharingMiles.findOne({
      where: {
        // "passengerJourneyId", "driverJourneyId", "userId",
        passengerJourneyId: passengerJourneyId,
        driverJourneyId: driverJourneyId,
        userId: meId
      }
    })
      .then(result => {
        if (result) {
          var co2 = 0.36 * result.miles;
          co2 = Math.round(co2 * 100) / 100;

          var miles = result.miles;
          miles = Math.round(miles * 100) / 100;

          result.update({ finished: true }).then(() => {
            res.status(200).json({ result: result, co2: co2, miles: miles });
          });
        } else {
          res.status(404).json({ message: "Couldn't find ride" });
        }
      })
      .catch(error => res.status(400).json(error));
  }
};
