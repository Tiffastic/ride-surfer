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
      origin: DataTypes.GEOGRAPHY("POINT"),
      destination: DataTypes.GEOGRAPHY("POINT"),
      arrivalAt: DataTypes.DATE
    },
    {}
  );
  Journey.associate = function(models) {
    Journey.hasMany(models.Trace, {
      foreignKey: "id",
      as: "traces"
    });
  };
  return Journey;
};
