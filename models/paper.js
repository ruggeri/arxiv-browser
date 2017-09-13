module.exports = (sequelize, DataTypes) => {
  const Paper = sequelize.define("Paper", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    link: {
      type: DataTypes.STRING,
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
