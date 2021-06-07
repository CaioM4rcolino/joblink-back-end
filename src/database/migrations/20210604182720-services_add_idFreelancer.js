'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
     await queryInterface.addColumn('services', "id_freelancer", {
          type: Sequelize.INTEGER,
          references:{
            model: "users", 
            key: "id"
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          allowNull:true
      }
     );
     
  },

  down: async (queryInterface, Sequelize) => {
  
      await queryInterface.removeColumn("services", 'id_freelancer');
    
  }
};
