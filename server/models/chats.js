"use strict";
module.exports = (sequelize, DataTypes) => {
  const Chats = sequelize.define(
    "Chats",
    {
      chatId: DataTypes.INTEGER,
      message: DataTypes.TEXT,
      senderId: DataTypes.INTEGER
    },
    {}
  );
  Chats.associate = function(models) {
    // associations can be defined here
  };
  return Chats;
};
