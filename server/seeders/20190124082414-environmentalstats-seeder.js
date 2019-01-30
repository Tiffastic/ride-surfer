"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("EnvironmentalStats", [
      {
        userId: 1,
        rideId: 1,
        co2: 1.2,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        userId: 2,
        rideId: 2,
        co2: 5.5,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        userId: 3,
        rideId: 3,
        co2: 0.5,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        userId: 4,
        rideId: 4,
        co2: 3.55,
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
