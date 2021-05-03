'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
  
     await queryInterface.createTable('services', { 

        id:{
          primaryKey: true,
          autoIncrement: true,
          type: Sequelize.INTEGER
        },
        is_from_client:{
          type: Sequelize.BOOLEAN,
          allowNull: false
        },
        progress:{
          type: Sequelize.INTEGER,
          allowNull: false
        },
        service_cost:{
          type: Sequelize.STRING,
          allowNull: true
        },
        rating:{
          type: Sequelize.STRING,
          allowNull: true
        },
        id_user:{
            type: Sequelize.INTEGER,
            references:{
              model: "users", 
              key: "id"
            },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          allowNull:false
        },
        id_post:{
            type: Sequelize.INTEGER,
            references:{
              model: "posts", 
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
  
    await queryInterface.dropTable('services');
     
  }
};
