const _ = require('lodash');

module.exports = (sequelize, DataTypes) => {
  let models = null;

  const Paper = sequelize.define("Paper", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    link: {
      type: DataTypes.STRING,
      notEmpty: true,
      notNull: true,
    },
    title: {
      type: DataTypes.STRING,
      notEmpty: true,
      notNull: true,
    },
    summary: {
      type: DataTypes.TEXT,
      notEmpty: true,
      notNull: true,
    },
    updateDateTime: {
      type: DataTypes.DATE,
      notNull: true,
    },
    publicationDateTime: {
      type: DataTypes.DATE,
      notNull: true,
    },
  }, {
    tableName: "papers",
  });

  Object.assign(Paper, {
    associate: (db) => { models = db; },
    papersForAuthors: async (authors, limit = 100) => {
      const authorships = await models.Authorship.forAuthors(authors);

      return await Paper.findAll({
        where: {id: {$in: authorships.map(a => a.paperId)}},
        order: [['publicationDateTime', 'DESC']],
        limit,
      })
    },

    queryByTitle: async (query, limit = 100) => (
      await Paper.findAll({
        where: {title: {$iLike: `%${query}%`}},
        order: [['publicationDateTime', 'DESC']],
        limit,
      })
    ),

    query: async (query, limit = 100) => {
      const papersByTitle = await Paper.queryByTitle(query, limit);
      const authors = await models.Author.queryByName(query, limit);
      const papersForAuthors = await Paper.papersForAuthors(authors, limit);

      return (
        _(papersByTitle)
          .unionBy(papersForAuthors, 'id')
          .orderBy(['publicationDateTime', 'desc'])
          .take(limit)
          .value()
      );
    }
  });

  return Paper;
};
