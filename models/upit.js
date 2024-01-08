const { Sequelize } = require('sequelize');
const db = require('../database');

var Upit = db.sequelize.define('Upit', {
    korisnik_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Korisnik',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    tekst_upita: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    nekretnina_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'Nekretnina',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
});

const Nekretnina = require('./nekretnina');
const Korisnik = require('./korisnik');

Nekretnina.hasMany(Upit, { as: 'upiti', foreignKey: 'nekretnina_id' });
Korisnik.hasMany(Upit, { as: 'upiti', foreignKey: 'korisnik_id' });
Upit.belongsTo(Nekretnina, { foreignKey: 'nekretnina_id' });
Upit.belongsTo(Korisnik, { foreignKey: 'korisnik_id' });

module.exports = Upit;
