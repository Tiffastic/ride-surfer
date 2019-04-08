const RideSharingMiles = require("../models").RideSharingMiles;

module.exports = {
  calculateStatsFromSurfMiles(req, res) {
    const meId = req.query.meId;

    RideSharingMiles.findAll({
      where: {
        userId: meId,
        finished: true
      }
    })
      .then(array => {
        var miles = 0;
        array.forEach(row => {
          miles += row.miles;
        });

        // Commute by Car – assumes 0.36 kg CO2e of gas consumed per mile
        // https://carbonfund.org/how-we-calculate/

        var co2 = 0.36 * miles;
        co2 = Math.round(co2 * 100) / 100;

        miles = Math.round(miles * 100) / 100;

        res.status(200).json({ totalMiles: miles, totalCO2: co2 });
      })
      .catch(error => res.status(400).json({ message: error }));
  }
};
