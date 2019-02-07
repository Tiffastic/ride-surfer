"use strict";
module.exports = (sequelize, DataTypes) => {
  const Bios = sequelize.define(
    "Bios",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userId: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      image: DataTypes.BLOB,
      ridesGiven: DataTypes.INTEGER,
      ridesTaken: DataTypes.INTEGER
    },
    {}
  );
  Bios.associate = function(models) {
    Bios.belongsTo(models.Users, { foreignKey: "userId", targetKey: "id" });
  };
  return Bios;
};
