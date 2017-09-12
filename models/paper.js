module.exports = (sequelize, DataTypes) => {
  const Paper = sequelize.define("Paper", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      notEmpty: true,
    }
  }, {
    tableName: "papers",
  });

  return Paper;
};
