"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .addColumn("Users", "home", {
        type: Sequelize.TEXT,
        unique: true,
        allowNull: true
      })
      .then(function() {
        queryInterface.addColumn("Users", "work", {
          type: Sequelize.TEXT,
          unique: true,
          allowNull: true
        });
      });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Users", "home").then(function() {
      queryInterface.removeColumn("Users", "work");
    });
  }
};
