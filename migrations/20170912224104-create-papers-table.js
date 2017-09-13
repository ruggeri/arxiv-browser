'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'papers',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        link: {
          type: Sequelize.STRING(1024),
          allowNull: false,
          unique: true,
        },
        title: {
          type: Sequelize.STRING(1024),
          allowNull: false,
        },
        summary: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        updateDateTime: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        publicationDateTime: {
          type: Sequelize.DATE,
          allowNull: false,
        },

        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('papers');
  }
};
