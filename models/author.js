module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define("Author", {
    name: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: "authors",
  });

  return Author;
}
