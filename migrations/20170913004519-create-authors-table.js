'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'authors',
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
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
      'authorships',
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
        },
        authorId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'authors',
            key: 'id',
          },
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

    await queryInterface.addConstraint('authorships', ['paperId', 'authorId'], {
      type: 'unique',
      name: 'paperIdAuthorIdUniqueConstraint',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('authorships');
    await queryInterface.dropTable('authors');
  }
};
