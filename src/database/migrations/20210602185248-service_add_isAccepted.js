'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
  
    await queryInterface.addColumn('services', 'is_accepted',{
      type: Sequelize.BOOLEAN,
      allowNull: false
    });
     
  },

  down: async (queryInterface, Sequelize) => {
   
    await queryInterface.removeColumn("services", "is_accepted")
     
  }
};
