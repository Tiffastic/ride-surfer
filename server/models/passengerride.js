"use strict";
module.exports = (sequelize, DataTypes) => {
  const PassengerRide = sequelize.define(
    "PassengerRide",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      pickupLocation: DataTypes.GEOMETRY("POINT"),
      dropoffLocation: DataTypes.GEOMETRY("POINT"),
      pickupTime: DataTypes.DATE,
      dropoffTime: DataTypes.DATE,
      driverAccepted: DataTypes.BOOLEAN
    },
    {}
  );
  PassengerRide.associate = function(models) {
    PassengerRide.belongsTo(models.Journey, {
      as: "passengerJourney",
      foreignKey: "passengerJourneyId",
      targetKey: "id",
      onDelete: "CASCADE"
    });
    PassengerRide.belongsTo(models.Journey, {
      as: "driverJourney",
      foreignKey: "driverJourneyId",
      targetKey: "id",
      onDelete: "CASCADE"
    });
  };
  return PassengerRide;
};
