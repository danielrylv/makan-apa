'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile, { foreignKey : 'UserId' });
      User.hasMany(models.Post, { foreignKey : 'UserId' });
      User.hasMany(models.Like, { foreignKey : 'UserId' });
    }
  };
  User.init({
    fullname: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  },{
    hooks: {
      beforeCreate: (instance, option) => {
        let words = instance.fullname.split(' ')
        let codeName = words.map(el => `${el[0].toLowerCase()}${el.slice(1).toLowerCase()}`);
        instance.username = codeName.join('_');
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};