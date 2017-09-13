'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'papers',
      {
        link: {
          type: Sequelize.STRING(1024),
          primaryKey: true,
          allowNull: false,
        },
        title: {
          type: Sequelize.STRING(1024),
          allowNull: false,
        },
        summary: {
          type: Sequelize.TEXT
        },
        updateDateTime: {
          type: Sequelize.DATE
        },
        publicationDateTime: {
          type: Sequelize.DATE
        },

        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        },
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('papers');
  }
};
