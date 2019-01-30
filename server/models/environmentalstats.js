"use strict";
module.exports = (sequelize, DataTypes) => {
  const EnvironmentalStats = sequelize.define(
    "EnvironmentalStats",
    {
      userId: DataTypes.INTEGER,
      rideId: DataTypes.INTEGER,
      co2: DataTypes.DOUBLE
    },
    {}
  );
  EnvironmentalStats.associate = function(models) {
    EnvironmentalStats.belongsTo(models.Users, {
      foreignKey: "userId",
      targetKey: "id"
    });
  };
  return EnvironmentalStats;
};
