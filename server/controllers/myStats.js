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
	WHERE "userId" = ${meId}  AND finished = true
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
WHERE "userId" = ${meId}  AND finished = true
GROUP BY EXTRACT(YEAR FROM Miles."updatedAt");`,

        { type: model.sequelize.QueryTypes.SELECT }
      )
      .then(array => {
        res.status(200).json({ co2PerYear: array });
      })
      .catch(err => res.status(400).json({ message: err }));
  },

  getMyActiveYears(req, res) {
    var meId = req.query.meId;
    if (!meId.match(/^\d+$/)) {
      // to prevent SQL inject attack, check that req.query.meId is a number and nothing else
      res.status(400).json({ message: "id is not a valid integer" });
    }

    model.sequelize
      .query(
        `
        SELECT DISTINCT EXTRACT(YEAR FROM "updatedAt") AS Year
      FROM public."RideSharingMiles" AS Miles
      WHERE "userId" = ${meId} AND finished = true`,

        { type: model.sequelize.QueryTypes.SELECT }
      )
      .then(array => {
        res.status(200).json({ activeYears: array });
      })
      .catch(err => res.status(400).json({ message: err }));
  },

  getMilesPerMonthData(req, res) {
    var meId = req.query.meId;
    var year = req.query.year;

    var meId = req.query.meId;
    if (!meId.match(/^\d+$/)) {
      // to prevent SQL inject attack, check that req.query.meId is a number and nothing else
      res.status(404).json({ message: "id is not a valid integer" });
    }

    if (!year.match(/^\d+$/)) {
      // to prevent SQL inject attack, check that req.query.year is a number and nothing else
      res.status(404).json({ message: "year is not a valid number" });
    }

    model.sequelize
      .query(
        `SELECT 
        SUM(miles) AS miles,
        CASE WHEN EXTRACT(MONTH FROM "updatedAt") = 1 THEN 'Jan'
        WHEN EXTRACT(MONTH FROM "updatedAt") = 2 THEN 'Feb'
        WHEN EXTRACT(MONTH FROM "updatedAt") = 3 THEN 'Mar'
        WHEN EXTRACT(MONTH FROM "updatedAt") = 4 THEN 'Apr'
        WHEN EXTRACT(MONTH FROM "updatedAt") = 5 THEN 'May'
        WHEN EXTRACT(MONTH FROM "updatedAt") = 6 THEN 'Jun'
        WHEN EXTRACT(MONTH FROM "updatedAt") = 7 THEN 'Jul'
        WHEN EXTRACT(MONTH FROM "updatedAt") = 8 THEN 'Aug'
        WHEN EXTRACT(MONTH FROM "updatedAt") = 9 THEN 'Sep'
        WHEN EXTRACT(MONTH FROM "updatedAt") = 10 THEN 'Oct'
        WHEN EXTRACT(MONTH FROM "updatedAt") = 11 THEN 'Nov'
        WHEN EXTRACT(MONTH FROM "updatedAt") = 12 THEN 'Dec'
        END AS Month
        FROM public."RideSharingMiles"
        WHERE "userId" = ${meId} AND finished = true AND EXTRACT(YEAR FROM "updatedAt") = ${year}
        GROUP BY EXTRACT(MONTH FROM "updatedAt")
        `,

        { type: model.sequelize.QueryTypes.SELECT }
      )
      .then(array => {
        res.status(200).json({ milesPerMonth: array });
      })
      .catch(err => res.status(400).json({ message: err }));
  },

  getCO2PerMonthData(req, res) {
    var meId = req.query.meId;
    var year = req.query.year;

    var meId = req.query.meId;
    if (!meId.match(/^\d+$/)) {
      // to prevent SQL inject attack, check that req.query.meId is a number and nothing else
      res.status(404).json({ message: "id is not a valid integer" });
    }

    if (!year.match(/^\d+$/)) {
      // to prevent SQL inject attack, check that req.query.year is a number and nothing else
      res.status(404).json({ message: "year is not a valid number" });
    }

    model.sequelize
      .query(
        `SELECT 
      SUM(miles) * 0.36 AS co2,
      CASE WHEN EXTRACT(MONTH FROM "updatedAt") = 1 THEN 'Jan'
      WHEN EXTRACT(MONTH FROM "updatedAt") = 2 THEN 'Feb'
      WHEN EXTRACT(MONTH FROM "updatedAt") = 3 THEN 'Mar'
      WHEN EXTRACT(MONTH FROM "updatedAt") = 4 THEN 'Apr'
      WHEN EXTRACT(MONTH FROM "updatedAt") = 5 THEN 'May'
      WHEN EXTRACT(MONTH FROM "updatedAt") = 6 THEN 'Jun'
      WHEN EXTRACT(MONTH FROM "updatedAt") = 7 THEN 'Jul'
      WHEN EXTRACT(MONTH FROM "updatedAt") = 8 THEN 'Aug'
      WHEN EXTRACT(MONTH FROM "updatedAt") = 9 THEN 'Sep'
      WHEN EXTRACT(MONTH FROM "updatedAt") = 10 THEN 'Oct'
      WHEN EXTRACT(MONTH FROM "updatedAt") = 11 THEN 'Nov'
      WHEN EXTRACT(MONTH FROM "updatedAt") = 12 THEN 'Dec'
      END AS Month
      FROM public."RideSharingMiles"
      WHERE "userId" = ${meId} AND finished = true AND EXTRACT(YEAR FROM "updatedAt") = ${year}
      GROUP BY EXTRACT(MONTH FROM "updatedAt")
        `,

        { type: model.sequelize.QueryTypes.SELECT }
      )
      .then(array => {
        res.status(200).json({ co2PerMonth: array });
      })
      .catch(err => res.status(400).json({ message: err }));
  }
};
