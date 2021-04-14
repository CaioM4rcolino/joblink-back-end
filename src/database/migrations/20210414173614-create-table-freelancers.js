'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("freelancers", {
      id:{
        type: Sequelize.INTEGER,
        references:{
          model: "users", 
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull:false
      },
      rating:{
        type: Sequelize.FLOAT,
        allowNull: false
      },
      years_experience:{
        type: Sequelize.STRING,
        allowNull: true
      },
      history:{
        type: Sequelize.TEXT,
        allowNull: true
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
   
    await queryInterface.dropTable('freelancers');

  }
};
