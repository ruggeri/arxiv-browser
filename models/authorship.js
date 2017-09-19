module.exports = (sequelize, DataTypes) => {
  const Authorship = sequelize.define("Authorship", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    paperId: {
      type: DataTypes.INTEGER,
      notNull: true,
    },
    authorId: {
      type: DataTypes.INTEGER,
      notNull: true,
    },
  }, {
    tableName: "authorships",
  });

  Object.assign(Authorship, {
    forAuthors: async (authors) => (
      await Authorship.findAll({
        where: {authorId: {$in: authors.map(a => a.id)}}
      })
    ),
  });

  return Authorship;
}
