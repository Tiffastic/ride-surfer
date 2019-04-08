"use strict";
module.exports = (sequelize, DataTypes) => {
  const RideSharingMiles = sequelize.define(
    "RideSharingMiles",
    {
      passengerJourneyId: DataTypes.INTEGER,
      driverJourneyId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      miles: DataTypes.REAL,
      finished: DataTypes.BOOLEAN
    },
    {}
  );
  RideSharingMiles.associate = function(models) {
    // associations can be defined here
    RideSharingMiles.belongsTo(models.Journey, {
      foreignKey: "passengerJourneyId",
      targetKey: "id",
      onDelete: "CASCADE"
    });

    RideSharingMiles.belongsTo(models.Journey, {
      foreignKey: "driverJourneyId",
      targetKey: "id",
      onDelete: "CASCADE"
    });

    RideSharingMiles.belongsTo(models.User, {
      targetKey: "id",
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
  };
  return RideSharingMiles;
};
