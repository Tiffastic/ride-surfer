"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("RateRides", [
      {
        personRatingId: 1,
        personRatedId: 2,
        rideId: 1,
        cleanliness: 4,
        timeliness: 5,
        safety: 5,
        overall: 4,
        comments:
          "I love riding with Two Fish. I got tangled in the seedweed he left in the car.",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        personRatingId: 2,
        personRatedId: 3,
        rideId: 2,
        cleanliness: 5,
        timeliness: 5,
        safety: 3,
        overall: 4,
        comments:
          "Thanks for picking me up Red Fish! Slow down a bit, it's okay if we're a bit late.",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        personRatingId: 3,
        personRatedId: 4,
        rideId: 3,
        cleanliness: 5,
        timeliness: 3,
        safety: 3,
        overall: 3,
        comments:
          "Red Fish was late for pickup again. She's so friendly, I would ride with her again if she picks me up on time.",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        personRatingId: 4,
        personRatedId: 1,
        rideId: 4,
        cleanliness: 5,
        timeliness: 5,
        safety: 5,
        overall: 5,
        comments: "",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
