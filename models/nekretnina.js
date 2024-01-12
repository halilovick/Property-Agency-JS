const { Sequelize } = require('sequelize');
const db = require('../config/database');

var Nekretnina = db.sequelize.define('Nekretnina', {
    tip_nekretnine: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [
                    ['Stan', 'Kuca', 'Poslovni prostor']
                ],
                msg: "Tip nekretnine mora biti Stan, Kuca ili Poslovni prostor"
            }
        }
    },
    naziv: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    kvadratura: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    cijena: {
        type: Sequelize.FLOAT,
        allowNull: false,
    },
    tip_grijanja: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lokacija: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    godina_izgradnje: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    datum_objave: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    opis: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    pretrage: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    klikovi: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
});

module.exports = Nekretnina;