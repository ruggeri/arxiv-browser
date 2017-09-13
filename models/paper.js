module.exports = (sequelize, DataTypes) => {
  const Paper = sequelize.define("Paper", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    link: {
      type: DataTypes.STRING,
      notEmpty: true,
      notNull: true,
    },
    title: {
      type: DataTypes.STRING,
      notEmpty: true,
      notNull: true,
    },
    summary: {
      type: DataTypes.TEXT,
      notEmpty: true,
      notNull: true,
    },
    updateDateTime: {
      type: DataTypes.DATE,
      notNull: true,
    },
    publicationDateTime: {
      type: DataTypes.DATE,
      notNull: true,
    },
  }, {
    tableName: "papers",
  });

  return Paper;
};
