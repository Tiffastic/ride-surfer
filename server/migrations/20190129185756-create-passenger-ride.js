"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("PassengerRides", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      passengerJourneyId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Journeys",
          key: "id",
          as: "passengerJourneyId"
        }
      },
      driverJourneyId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Journeys",
          key: "id",
          as: "driverJourneyId"
        }
      },
      pickupLocation: {
        type: Sequelize.GEOMETRY
      },
      dropoffLocation: {
        type: Sequelize.GEOMETRY
      },
      pickupTime: {
        type: Sequelize.DATE
      },
      dropoffTime: {
        type: Sequelize.DATE
      },
      driverAccepted: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("PassengerRides");
  }
};
