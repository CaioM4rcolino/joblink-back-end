'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.createTable("post-category", {
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      post_id: {
        type: Sequelize.INTEGER,
        references:{
          model: "posts", 
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        allowNull: false
      },
      category_id: {
          type: Sequelize.INTEGER,
          references:{
            model: "categories", 
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
    
    await queryInterface.dropTable('post-category');
     
  }
};
