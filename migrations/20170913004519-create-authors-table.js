'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'authors',
      {
        name: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false
        },

        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        },
      }
    );

    await queryInterface.createTable(
      'authorships',
      {
        paperLink: {
          type: Sequelize.STRING(1024),
          allowNull: false,
          references: {
            model: 'papers',
            key: 'link',
          }
        },
        authorName: {
          type: Sequelize.STRING,
          allowNull: false,
          references: {
            model: 'authors',
            key: 'name',
          }
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('authorships');
    await queryInterface.dropTable('authors');
  }
};
