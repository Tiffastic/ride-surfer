"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("Bios", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        userId: {
          type: Sequelize.INTEGER
        },
        description: {
          type: Sequelize.TEXT
        },
        image: {
          type: Sequelize.TEXT
        },
        ridesGiven: {
          type: Sequelize.INTEGER
        },
        ridesTaken: {
          type: Sequelize.INTEGER
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
        queryInterface.addConstraint("Bios", ["userId"], {
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
    return queryInterface.dropTable("Bios");
  }
};
