"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Vehicles", [
      {
        userId: 1,
        make: "Toyota",
        model: "Camry",
        vin: "ONE-FISH-CAR-1",
        policyNumber: "123-456-789-ONE-FISH",
        policyProvider: "All State",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        make: "Tesla",
        model: "Model 3",
        vin: "TWO-FISH-CAR-2",
        policyNumber: "123-456-789-TWO-FISH",
        policyProvider: "State Farm",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 3,
        make: "Suzuki",
        model: "Forenza",
        vin: "BLUE-FISH-CAR-3",
        policyNumber: "123-456-789-BLUE-FISH",
        policyProvider: "GEIKO",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 4,
        make: "Ford",
        model: "Mustang",
        vin: "RED-FISH-CAR-4",
        policyNumber: "123-456-789-RED-FISH",
        policyProvider: "Liberty Mutual",
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
