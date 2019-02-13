"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Journeys", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Users",
          key: "id",
          as: "userId"
        }
      },
      origin: {
        type: Sequelize.GEOMETRY
      },
      destination: {
        type: Sequelize.GEOMETRY
      },
      arrivalAt: {
        type: Sequelize.DATE
      },
      isDriver: {
        type: Sequelize.BOOLEAN
      },
      path: {
        type: Sequelize.GEOMETRY
      },
      currentLocation: {
        type: Sequelize.GEOMETRY
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
    return queryInterface.dropTable("Journeys");
  }
};
