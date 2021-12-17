'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcryptjs');
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
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Nama harus diisi!'
        }
      }
    },
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Email harus diisi!'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password harus diisi!'
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Role harus diisi!'
        }
      }
    }
  },{
    hooks: {
      beforeCreate: (instance, option) => {
        let words = instance.fullname.split(' ')
        let codeName = words.map(el => `${el[0].toLowerCase()}${el.slice(1).toLowerCase()}`);
        instance.username = codeName.join('_');
        const salt = bcrypt.genSaltSync(8);
        const hash = bcrypt.hashSync(instance.password, salt);
        
        instance.password = hash;
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};