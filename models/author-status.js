module.exports = (sequelize, DataTypes) => {
  const AuthorStatus = sequelize.define("AuthorStatus", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    authorId: {
      type: DataTypes.INTEGER,
      notNull: true,
    },
    isStared: {
      type: DataTypes.BOOLEAN,
      notNull: true,
    },
  }, {
    tableName: "authorStatuses",
  });

  return AuthorStatus;
}
