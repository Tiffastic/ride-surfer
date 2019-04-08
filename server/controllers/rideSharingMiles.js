const RideSharingMiles = require("../models").RideSharingMiles;

module.exports = {
  storeRideRequest(req, res) {
    RideSharingMiles.create(req.body, { fields: Object.keys(req.body) })
      .then(result => {
        res.status(201).json(result);
      })
      .catch(error => res.status(400).json(error));
  },

  storeBothOurRides(req, res) {
    var meId = req.body.meId;
    var youId = req.body.youId;
    var passengerJourneyId = req.body.passengerJourneyId;
    var driverJourneyId = req.body.driverJourneyId;
    var miles = req.body.miles;

    //
    //  "passengerJourneyId", "driverJourneyId", "userId", miles,

    var createdMyRow = false;
    var createdYourRow = false;

    RideSharingMiles.create({
      passengerJourneyId: passengerJourneyId,
      driverJourneyId: driverJourneyId,
      userId: meId,
      miles: miles
    })
      .then(result => {
        createdMyRow = true;
        if (createdMyRow && createdYourRow) {
          res.status(201).json({
            meId: meId,
            youId: youId,
            passengerJourneyId: passengerJourneyId,
            driverJourneyId: driverJourneyId,
            miles: miles
          });
        }
      })
      .catch(error => res.status(400).json(error));

    RideSharingMiles.create({
      passengerJourneyId: passengerJourneyId,
      driverJourneyId: driverJourneyId,
      userId: youId,
      miles: miles
    })
      .then(result => {
        createdYourRow = true;
        if (createdMyRow && createdYourRow) {
          res.status(201).json({
            meId: meId,
            youId: youId,
            passengerJourneyId: passengerJourneyId,
            driverJourneyId: driverJourneyId,
            miles: miles
          });
        }
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
