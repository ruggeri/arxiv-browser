module.exports = (sequelize, DataTypes) => {
  const Paper = sequelize.define("Paper", {
    link: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      notEmpty: true,
    },
    summary: {
      type: DataTypes.TEXT,
      notEmpty: true,
    },
    updateDateTime: {
      type: DataTypes.DATE,
      notEmpty: true
    },
    publicationDateTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: "papers",
  });

  return Paper;
};
