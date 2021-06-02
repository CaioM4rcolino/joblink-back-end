'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    await queryInterface.createTable('chat', {
      
      id:{
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      id_service:{
        type: Sequelize.INTEGER,
        references:{
          model: "services",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull:false
      },
      created_at:{
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at:{
        type: Sequelize.DATE,
        allowNull: false
      }

    });
     
  },

  down: async (queryInterface, Sequelize) => {
 
    await queryInterface.dropTable('chat');
     
  }
};
