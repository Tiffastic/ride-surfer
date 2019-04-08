"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("RideSharingMiles", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      passengerJourneyId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Journeys",
          key: "id",
          as: "passengerJourneyId"
        }
      },
      driverJourneyId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Journeys",
          key: "id",
          as: "driverJourneyId"
        }
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
          as: "userId"
        }
      },
      miles: {
        type: Sequelize.REAL
      },
      finished: {
        type: Sequelize.BOOLEAN,
        default: false
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
    return queryInterface.dropTable("RideSharingMiles");
  }
};
