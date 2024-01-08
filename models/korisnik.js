const { Sequelize } = require('sequelize');
const db = require('../database');

const Korisnik = db.sequelize.define('Korisnik', {
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