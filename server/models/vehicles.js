"use strict";
module.exports = (sequelize, DataTypes) => {
  const Vehicles = sequelize.define(
    "Vehicles",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userId: DataTypes.INTEGER,
      make: DataTypes.TEXT,
      model: DataTypes.TEXT,
      vin: { type: DataTypes.TEXT, unique: true },
      policyNumber: DataTypes.TEXT,
      policyProvider: DataTypes.INTEGER
    },
    {}
  );
  Vehicles.associate = function(models) {
    Vehicles.belongsTo(models.User, {
      foreignKey: "userId",
      targetKey: "id"
    });
  };
  return Vehicles;
};
