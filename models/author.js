module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define("Author", {
    name: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
  }, {
    tableName: "authors",
  });

  return Author;
}
