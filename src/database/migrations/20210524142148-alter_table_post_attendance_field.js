'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    await queryInterface.changeColumn('posts', 'attendance',{
      type: Sequelize.STRING
    })
     
  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.dropTable('users');
     
  }
};
