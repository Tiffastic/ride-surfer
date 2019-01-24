"use strict";
module.exports = (sequelize, DataTypes) => {
  const Trace = sequelize.define(
    "Trace",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      journeyId: DataTypes.INTEGER,
      location: DataTypes.GEOGRAPHY("POINT"),
      timestamp: DataTypes.DATE
    },
    {}
  );
  Trace.associate = function(models) {
    Trace.belongsTo(models.Journey, {
      foreignKey: "journeyId",
      onDelete: "CASCADE"
    });
  };
  return Trace;
};
