'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
 
     await queryInterface.createTable('balance_register', {
       id:{
          primaryKey: true,
          type:Sequelize.INTEGER,
          autoIncrement: true
       },
       value:{
          type: Sequelize.STRING,
          allowNull: false
       },
       status_flow:{
         type: Sequelize.STRING,
         allowNull: false
       },
       id_freelancer:{
        type: Sequelize.INTEGER,
        references:{
          model: "users", 
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
    
     await queryInterface.dropTable('balance_register');
  }
};
