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
      arrivalAt: DataTypes.DATE,
      isDriver: DataTypes.BOOLEAN,
      path: DataTypes.GEOGRAPHY("LINE")
    },
    {}
  );
  Journey.associate = function(models) {
    Journey.hasMany(models.Trace, {
      foreignKey: "journeyId",
      as: "traces"
    });
    Journey.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
  };
  return Journey;
};
