'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

      await queryInterface.bulkInsert('categories', [

        {
          name: "consertos elétricos",
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: "consertos mecânicos",
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: "encanamento",
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: "pintura de residências",
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: "problemas de internet e redes de computadores",
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: "costura e remenda de peças",
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: "websites e interface gráfica",
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: "contabilidade",
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: "conserto de celulares",
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: "serviços de engenharia civil",
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: "mudanças e carretos",
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: "conserto de eletrodomésticos",
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: "advocacia",
          created_at: new Date(),
          updated_at: new Date()
        },
        

      ]);
    
  },

  down: async (queryInterface, Sequelize) => {
    
     await queryInterface.bulkDelete('categories');
     
  }
};
