'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
   
      await queryInterface.changeColumn('Users', 'role', {
        type: Sequelize.ENUM('0','1','2'), // New data type
        allowNull: true, // Adjust as needed
      });
  


  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('Users', 'role', {
      type: Sequelize.INTEGER, // New data type
      allowNull: true, // Adjust as needed
    });
  }
};
