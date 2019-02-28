"use strict";
module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define(
    "Vehicle",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      make: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          isAlpha: {
            msg: "Car make can only contain letters"
          }
        }
      },
      model: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          isAlphanumeric: {
            msg: "Car Model can not contain symbols"
          }
        }
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          isNumeric: {
            msg: "Car year can only contain numbers"
          }
        }
      },
      plate: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          isAlphanumeric: {
            msg: "Plate can not contain symbols"
          }
        }
      },
      vin: {
        type: DataTypes.TEXT,
        allowNull: true,
        unique: true,
        validate: {
          isAlphanumeric: {
            msg: "Vin can not contain symbols"
          }
        }
      },
      policyNumber: {
        type: DataTypes.TEXT,
        allowNull: true,
        unique: true,
        validate: {
          isAlphanumeric: {
            msg: "Policy number can not contain symbols"
          }
        }
      },
      policyProvider: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {}
  );
  Vehicle.associate = function(models) {
    Vehicle.belongsTo(models.User, {
      foreignKey: "userId",
      targetKey: "id"
    });
  };
  return Vehicle;
};
