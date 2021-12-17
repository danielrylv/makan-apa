'use strict';
const {
  Model
} = require('sequelize');

const createUsername = require('../helpers/createUsername');

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
        },
        isEmail: {
          msg: 'Format email salah!'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Password harus diisi!'
        },
        len: {
          args: [8],
          msg: 'Password harus beriskan minimal 8 karakter!'
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
        instance.username = createUsername(instance.fullname);
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