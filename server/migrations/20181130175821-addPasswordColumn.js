'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'password', Sequelize.TEXT );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', 'password' );
  }
};
