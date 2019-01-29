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
      passengerJourneyId: DataTypes.INTEGER,
      driverJourneyId: DataTypes.INTEGER,
      pickupLocation: DataTypes.GEOGRAPHY("POINT"),
      dropoffLocation: DataTypes.GEOGRAPHY("POINT"),
      pickupTime: DataTypes.DATE,
      dropoffTime: DataTypes.DATE,
      driverAccepted: DataTypes.BOOLEAN
    },
    {}
  );
  PassengerRide.associate = function(models) {
    PassengerRide.belongsTo(models.Journey, {
      foreignKey: "passengerJouneyId",
      onDelete: "CASCADE"
    });
    PassengerRide.belongsTo(models.Journey, {
      foreignKey: "driverJouneyId",
      onDelete: "CASCADE"
    });
  };
  return PassengerRide;
};
