'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'authors',
      {
        name: {
          type: Sequelize.STRING,
          primaryKey: true,
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
          autoIncrement: true,
          primaryKey: true,
        },
        paperLink: {
          type: Sequelize.STRING(1024),
          allowNull: false,
          references: {
            model: 'papers',
            key: 'link',
          },
        },
        authorName: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: 'authors',
            key: 'name',
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

    await queryInterface.addConstraint('authorships', ['paperLink', 'authorName'], {
      type: 'unique',
      name: 'paperLinkAuthorNameUniqueConstraint',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('authorships');
    await queryInterface.dropTable('authors');
  }
};