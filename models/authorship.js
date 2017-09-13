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

  return Authorship;
}
