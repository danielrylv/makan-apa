'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, { foreignKey : 'UserId' });
      Post.belongsToMany(models.Tag, { through: 'PostTags', onDelete: 'CASCADE' });
      Post.hasMany(models.Like, { onDelete: 'CASCADE' });
    }
  };
  Post.init({
    content: DataTypes.STRING,
    imgUrl: DataTypes.STRING,
    blocked: DataTypes.BOOLEAN,
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
    hooks: {
      beforeCreate(post) {
        post.blocked = false;
      }
    }
  });
  return Post;
};