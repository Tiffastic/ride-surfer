"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("Vehicles", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        userId: {
          type: Sequelize.INTEGER
        },
        make: {
          type: Sequelize.TEXT
        },
        model: {
          type: Sequelize.TEXT
        },
        year: {
          type: Sequelize.INTEGER
        },
        plate: {
          type: Sequelize.TEXT
        },
        vin: {
          type: Sequelize.TEXT,
          unique: true
        },
        policyNumber: {
          type: Sequelize.TEXT
        },
        policyProvider: {
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
      })
      .then(() => {
        queryInterface.addConstraint("Vehicles", ["userId"], {
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
    return queryInterface.dropTable("Vehicles");
  }
};
