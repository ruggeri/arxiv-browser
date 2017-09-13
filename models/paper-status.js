module.exports = (sequelize, DataTypes) => {
  const PaperStatus = sequelize.define("PaperStatus", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    paperId: {
      type: DataTypes.INTEGER,
      notNull: true,
    },
    isArchived: {
      type: DataTypes.BOOLEAN,
      notNull: true,
    },
    isStarred: {
      type: DataTypes.BOOLEAN,
      notNull: true,
    },
  }, {
    tableName: "paperStatuses",
  });

  return PaperStatus;
}
