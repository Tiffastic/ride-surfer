"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("RateRides", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      personRatingId: {
        type: Sequelize.INTEGER
      },
      personRatedId: {
        type: Sequelize.INTEGER
      },
      rideId: {
        type: Sequelize.INTEGER
      },
      cleanliness: {
        type: Sequelize.INTEGER
      },
      timeliness: {
        type: Sequelize.INTEGER
      },
      safety: {
        type: Sequelize.INTEGER
      },
      overall: {
        type: Sequelize.INTEGER
      },
      comments: {
        type: Sequelize.TEXT
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
    return queryInterface.dropTable("RateRides");
  }
};
