"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("EnvironmentalStats", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        userId: {
          type: Sequelize.INTEGER
        },
        rideId: {
          type: Sequelize.INTEGER
        },
        co2: {
          type: Sequelize.DOUBLE
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      })
      .then(() => {
        queryInterface.addConstraint("EnvironmentalStats", ["userId"], {
          type: "foreign key",
          name: "fk_userId",
          references: {
            table: "Users",
            field: "id"
          },
          onDelete: "no action",
          onUpdate: "no action"
        });
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("EnvironmentalStats");
  }
};
