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
      carPlate: DataTypes.TEXT,
      carMake: DataTypes.TEXT,
      carModel: DataTypes.TEXT,
      carYear: DataTypes.INTEGER,
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
  };
  return User;
};
