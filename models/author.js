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

  return Author;
}
