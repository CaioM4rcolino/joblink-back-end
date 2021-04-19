'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.createTable("user-profession", {

      id:{
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
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
      profession_id:{
        type: Sequelize.INTEGER,
        references:{
          model: "professions", 
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
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("user-profession")
  }
};
