module.exports = (sequelize, DataTypes) => {
  const Authorship = sequelize.define("Authorship", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    paperId: {
      type: DataTypes.INTEGER,
      notEmpty: true,
    },
    authorId: {
      type: DataTypes.INTEGER,
      notEmpty: true,
    },
  }, {
    tableName: "authorships",
  });

  return Authorship;
}
