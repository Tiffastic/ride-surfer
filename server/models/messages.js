"use strict";
module.exports = (sequelize, DataTypes) => {
  const Messages = sequelize.define(
    "Messages",
    {
      userIdSender: DataTypes.INTEGER,
      userIdRecipient: DataTypes.INTEGER,
      message: DataTypes.TEXT
    },
    {}
  );
  Messages.associate = function(models) {
    // associations can be defined here
  };
  return Messages;
};
