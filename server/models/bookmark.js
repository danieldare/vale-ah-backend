module.exports = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define(
    'Bookmark',
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      recipeId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  Bookmark.associate = models => {
    // associations can be defined here
    Bookmark.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'owner'
    });
    Bookmark.belongsTo(models.Recipe, {
      foreignKey: 'recipeId',
      onDelete: 'CASCADE'
    });
  };
  return Bookmark;
};