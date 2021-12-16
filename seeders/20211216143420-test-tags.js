'use strict';

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
    const tags = [
      'bakso', 'sate', 'jakarta', 'bandung',
      'dingin', 'panas', 'manis', 'pedas',
      'palembang', 'cemilan', 'gurih', 'mie',
      'nasi', 'soto'
    ]
    .map(tag => ({
      name: tag,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    return queryInterface.bulkInsert('Tags', tags);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Tags');
  }
};
