'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.createTable('messages', {
      id:{
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      message_description:{
        type: Sequelize.TEXT,
        allowNull: false
      },
      message_author:{
        type: Sequelize.INTEGER,
        references:{
          model: "users", 
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull:false
      },
      id_chat:{
        type: Sequelize.INTEGER,
        references:{
          model: "chat", 
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
   
    await queryInterface.dropTable('messages');
     
  }
};
