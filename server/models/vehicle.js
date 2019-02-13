"use strict";
module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define(
    "Vehicle",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userId: DataTypes.INTEGER,
      make: DataTypes.TEXT,
      model: DataTypes.TEXT,
      year: DataTypes.INTEGER,
      plate: DataTypes.TEXT,
      vin: { type: DataTypes.TEXT, unique: true },
      policyNumber: DataTypes.TEXT,
      policyProvider: DataTypes.INTEGER
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
