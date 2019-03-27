"use strict";
module.exports = (sequelize, DataTypes) => {
  const MyChats = sequelize.define(
    "MyChats",
    {
      senderId: DataTypes.INTEGER,
      recipientId: DataTypes.INTEGER,
      chatId: DataTypes.INTEGER
    },
    {}
  );
  MyChats.associate = function(models) {
    // associations can be defined here
    MyChats.belongsTo(models.User, { foreignKey: "senderId", targetKey: "id" });
  };
  return MyChats;
};
