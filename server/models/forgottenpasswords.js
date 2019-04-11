const bcrypt = require("react-native-bcrypt");
const validator = require("validator");

("use strict");
module.exports = (sequelize, DataTypes) => {
  const ForgottenPasswords = sequelize.define(
    "ForgottenPasswords",
    {
      email: DataTypes.TEXT,
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        validate: {
          encrypt(value) {
            if (validator.isEmpty(value)) {
              throw new Error("Password must not be blank!!!!");
            }
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(value, salt);
            this.password = hash;
          }
        }
      }
    },
    {}
  );
  ForgottenPasswords.associate = function(models) {
    // associations can be defined here
  };
  return ForgottenPasswords;
};
