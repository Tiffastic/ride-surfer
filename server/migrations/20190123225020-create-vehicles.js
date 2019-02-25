"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("Vehicles", {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        make: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        model: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        year: {
          type: Sequelize.INTEGER,
          allowNull: true
        },
        plate: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        vin: {
          type: Sequelize.TEXT,
          allowNull: true,
          unique: true
        },
        policyNumber: {
          type: Sequelize.TEXT,
          allowNull: true,
          unique: true
        },
        policyProvider: {
          type: Sequelize.TEXT,
          allowNull: true
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
