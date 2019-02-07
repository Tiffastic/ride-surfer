"use strict";
module.exports = (sequelize, DataTypes) => {
  const RateRides = sequelize.define(
    "RateRides",
    {
      personRatingId: DataTypes.INTEGER,
      personRatedId: DataTypes.INTEGER,
      rideId: DataTypes.INTEGER,
      cleanliness: DataTypes.INTEGER,
      timeliness: DataTypes.INTEGER,
      safety: DataTypes.INTEGER,
      overall: DataTypes.INTEGER,
      comments: DataTypes.TEXT
    },
    {}
  );
  RateRides.associate = function(models) {
    RateRides.belongsTo(models.User, {
      foreignKey: "personRatingId",
      targetKey: "id"
    });
    RateRides.belongsTo(models.User, {
      foreignKey: "personRatedId",
      targetKey: "id"
    });
  };
  return RateRides;
};
