'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('balance_register', 'id_service', {
      type: Sequelize.INTEGER,
      references:{
          model: "services",
          key: "id"
        },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      allowNull:false
    })
  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.removeColumn('balance_register', 'id_service');
     
  }
};
