'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
      await queryInterface.bulkInsert('professions', 
      [
        {
        name: 'eletricista',
        created_at: new Date(),
        updated_at: new Date()
        },

        {
        name: 'mecânico',
        created_at: new Date(),
        updated_at: new Date()
        },

        {
          name: 'encanador',
          created_at: new Date(),
          updated_at: new Date()
        },

        {
          name: 'pintor',
          created_at: new Date(),
          updated_at: new Date()
        },

        {
          name: 'técnico de redes',
          created_at: new Date(),
          updated_at: new Date()
        },

        {
          name: 'costura e remenda de peças',
          created_at: new Date(),
          updated_at: new Date()
        },

        {
          name: 'web designer',
          created_at: new Date(),
          updated_at: new Date()
        },

        {
          name: 'contador',
          created_at: new Date(),
          updated_at: new Date()
        },

        {
          name: 'conserto de celulares',
          created_at: new Date(),
          updated_at: new Date()
        },

        {
          name: 'pedreiro',
          created_at: new Date(),
          updated_at: new Date()
        },

        {
          name: 'profissional de mudanças e carretos',
          created_at: new Date(),
          updated_at: new Date()
        },

        {
          name: 'conserto de eletrodomésticos',
          created_at: new Date(),
          updated_at: new Date()
        },
        
        {
          name: 'advogado',
          created_at: new Date(),
          updated_at: new Date()
        },
    ]);
  
  },

  down: async (queryInterface, Sequelize) => {
    
     await queryInterface.bulkDelete('professions');
    
  }
};
