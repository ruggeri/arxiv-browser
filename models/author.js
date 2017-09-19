module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define("Author", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      notEmpty: true,
      notNull: true,
    },
  }, {
    tableName: "authors",
  });

  Object.assign(Author, {
    queryByName: async (query) => (
      await Author.findAll({
        where: {name: {$iLike: `%${query}%`}},
      })
    )
  })

  return Author;
}
