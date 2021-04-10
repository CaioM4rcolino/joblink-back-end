'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("freelancers", {
      id:{
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      name:{
        type: Sequelize.STRING,
        allowNull: false
      },
      birth_date:{
        type: Sequelize.STRING,
        allowNull: false
      },
      email:{
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cpf:{
        type: Sequelize.STRING,
        allowNull: false
      },
      image:{
        type: Sequelize.STRING,
        allowNull: true
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
      banned: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      suspended: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      online:{
        type: Sequelize.BOOLEAN,
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
