'use strict';

const fs = require('fs');
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const jstring = fs.readFileSync('./data/test-users.json', 'utf8');
    const json = JSON.parse(jstring);

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const plainPassword = '12345678';
    const password = bcrypt.hashSync(plainPassword, salt); 

    const users = json.map(user => (
      user.password = password,
      user.role = 'user',
      user.createdAt = new Date(),
      user.updatedAt = new Date(),
      user
    ));

    console.log(users);

    return queryInterface.bulkInsert('Users', users);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Users');
  }
};
