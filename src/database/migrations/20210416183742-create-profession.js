'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
  
    await queryInterface.createTable('professions', 

    {
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      name:{
        type: Sequelize.STRING,
        allowNull: false
      },
      user_id:{
        type: Sequelize.INTEGER,
        references:{
          model: "users", 
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false
      },
      created_at:{
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at:{
        type: Sequelize.DATE,
        allowNull: false
      }
    
    }   
      
    );
     
  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.dropTable('professions');
     
  }
};
