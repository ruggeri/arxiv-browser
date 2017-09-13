'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'paperStatuses',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false, 
          autoIncrement: true,
          primaryKey: true,
        },
        paperId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'papers',
            key: 'id',
          },
          unique: true,
        },
        isArchived: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        isStared: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
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
    
    await queryInterface.createTable(
      'authorStatuses',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false, 
          autoIncrement: true,
          primaryKey: true,
        },
        authorId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'authors',
            key: 'id',
          },
          unique: true,
        },
        isStared: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('authorStatuses');
    await queryInterface.dropTable('paperStatuses');
  }
};
