const { Sequelize } = require('sequelize');
const sequelize = require('../database');

const Korisnik = sequelize.define('Korisnik', {
  ime: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  prezime: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});
module.exports = Korisnik;