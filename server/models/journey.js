"use strict";
module.exports = (sequelize, DataTypes) => {
  const Journey = sequelize.define(
    "Journey",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userId: DataTypes.INTEGER,
      origin: DataTypes.GEOMETRY("POINT"),
      destination: DataTypes.GEOMETRY("POINT"),
      arrivalAt: DataTypes.DATE,
      isDriver: DataTypes.BOOLEAN,
      path: DataTypes.GEOMETRY("LINE")
    },
    {}
  );
  Journey.associate = function(models) {
    Journey.hasMany(models.Trace, {
      sourceKey: "id",
      foreignKey: "journeyId",
      as: { singular: "trace", plural: "traces" }
    });
    Journey.hasMany(models.PassengerRide, {
      sourceKey: "id",
      foreignKey: "passengerJourneyId",
      as: { singular: "passengerRide", plural: "passengerRides" }
    });
    Journey.hasMany(models.PassengerRide, {
      sourceKey: "id",
      foreignKey: "driverJourneyId",
      as: { singular: "driverRide", plural: "driverRides" }
    });
    Journey.belongsTo(models.User, {
      targetKey: "id",
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
  };
  return Journey;
};
