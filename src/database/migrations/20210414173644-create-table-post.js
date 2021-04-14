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
    client_id: {
      type: Sequelize.INTEGER,
      references:{
        model: "clients", 
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      allowNull:false

    },
    freelancer_id: {
      type: Sequelize.INTEGER,
      references:{
        model: "freelancers", 
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
