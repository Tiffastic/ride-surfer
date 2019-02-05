"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Traces", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      journeyId: {
        type: Sequelize.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "Journeys",
          key: "id",
          as: "journeyId"
        }
      },
      location: {
        type: Sequelize.GEOMETRY
      },
      timestamp: {
        type: Sequelize.DATE
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
    return queryInterface.dropTable("Traces");
  }
};
