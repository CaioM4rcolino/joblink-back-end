'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.addColumn('services', 'feedback', {
      type: Sequelize.TEXT,
      allowNull: true
    });

  },

  down: async (queryInterface, Sequelize) => {
    /**s
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};