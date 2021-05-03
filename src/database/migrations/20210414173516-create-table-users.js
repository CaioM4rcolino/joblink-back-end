'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      is_freelancer:{
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      agreed_policy:{
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      name:{
        type: Sequelize.STRING,
        allowNull: false
      },
      gender: {
        type: Sequelize.STRING,
        allowNull:false
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
      adress:{
        type: Sequelize.STRING,
        allowNull: false
      },
      phone_number:{
        type: Sequelize.STRING,
        allowNull: true
      },
      image:{
        type: Sequelize.STRING,
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
  
    await queryInterface.dropTable('users');

  }
};
