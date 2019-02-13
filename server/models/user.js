"use strict";
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      firstName: DataTypes.TEXT,
      lastName: DataTypes.TEXT,
      email: DataTypes.TEXT,
      password: DataTypes.TEXT,
      pushToken: {
        type: DataTypes.TEXT,
        unique: true
      }
    },
    {}
  );
  User.associate = function(models) {
    User.hasMany(models.Journey, {
      sourceKey: "id",
      foreignKey: "userId",
      as: "journeys"
    });
    User.hasMany(models.Vehicle, {
      sourceKey: "id",
      foreignKey: "userId",
      as: "vehicles"
    });
  };
  return User;
};
