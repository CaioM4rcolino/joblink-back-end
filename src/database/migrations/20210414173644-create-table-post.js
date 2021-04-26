'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   await queryInterface.createTable('posts', {

    id:{
      primaryKey: true,
      type: Sequelize.INTEGER,
      autoIncrement: true
    },
    title:{
      type: Sequelize.STRING,
      allowNull: false
    },
    description:{
      type: Sequelize.TEXT,
      allowNull: false
    },
    image:{
      type: Sequelize.STRING,
      allowNull: true
    },
    urgency:{
      type: Sequelize.STRING,
      allowNull: false
    },
    attendance:{
      type: Sequelize.STRING,
      allowNull: false
    },
    user_id: {
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

   })
  },

  down: async (queryInterface, Sequelize) => {
  
     
    await queryInterface.dropTable('posts');
     
  }
};
