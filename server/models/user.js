const bcrypt = require("react-native-bcrypt");
const validator = require("validator");

("use strict");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      firstName: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "First name is empty"
          }
        }
      },
      lastName: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Last name is empty"
          }
        }
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: {
            msg: "Email must not be blank"
          },
          isEmail: {
            msg: "Email format invalid"
          }
        }
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Password must not be blank."
          },
          len: {
            args: [2, 99],
            msg: "Password must be at least 2 characters long"
          },
          encrypt(value) {
            if (validator.isEmpty(value)) {
              throw new Error("Password must not be blank!!!!");
            }
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(value, salt);
            this.password = hash;
          }
        }
      },
      pushToken: {
        type: DataTypes.TEXT,
        unique: true,
        allowNull: true
      },
      home: {
        type: DataTypes.TEXT,
        unique: true,
        allowNull: true
      },
      work: {
        type: DataTypes.TEXT,
        unique: true,
        allowNull: true
      },
      facebookLink: {
        type: DataTypes.TEXT,
        allowNull: true
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
