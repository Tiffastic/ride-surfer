const RideSharingMiles = require("../models").RideSharingMiles;
const model = require("../models");

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
  },

  getMilesPerYearData(req, res) {
    var meId = req.query.meId;

    if (!meId.match(/^\d+$/)) {
      // to prevent SQL inject attack, check that req.query.meId is a number and nothing else
      res.status(400).json({ message: "id is not a valid integer" });
    }

    model.sequelize
      .query(
        `SELECT EXTRACT(YEAR FROM Miles."updatedAt") AS Year, SUM(miles) AS Miles
	FROM public."RideSharingMiles" AS Miles
	WHERE "userId" = ${meId}
	GROUP BY EXTRACT(YEAR FROM Miles."updatedAt");`,

        { type: model.sequelize.QueryTypes.SELECT }
      )
      .then(array => {
        res.status(200).json({ milesPerYear: array });
      })
      .catch(err => res.status(400).json({ message: err }));
  },

  getCO2PerYearData(req, res) {
    var meId = req.query.meId;
    if (!meId.match(/^\d+$/)) {
      // to prevent SQL inject attack, check that req.query.meId is a number and nothing else
      res.status(400).json({ message: "id is not a valid integer" });
    }

    model.sequelize
      .query(
        `SELECT EXTRACT(YEAR FROM Miles."updatedAt") AS Year, SUM(miles)*0.36 AS CO2
FROM public."RideSharingMiles" AS Miles
WHERE "userId" = ${meId}
GROUP BY EXTRACT(YEAR FROM Miles."updatedAt");`,

        { type: model.sequelize.QueryTypes.SELECT }
      )
      .then(array => {
        res.status(200).json({ co2PerYear: array });
      })
      .catch(err => res.status(400).json({ message: err }));
  }
};
