module.exports = (sequelize, DataTypes) => {
  const Authorship = sequelize.define("Authorship", {
    paperLink: {
      type: DataTypes.STRING,
      notEmpty: true,
    },
    authorName: {
      type: DataTypes.STRING,
      notEmpty: true,
    },
  }, {
    tableName: "authorships",
  });

  return Authorship;
}
