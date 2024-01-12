const Korisnik = require('../models/korisnik');
const Nekretnina = require('../models/nekretnina');
const Upit = require('../models/upit');
const db = require('./database');

db.sequelize.sync({ force: true }).then(function () {
    dbInitialize().then(function () {
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
        process.exit();
    });
});

function dbInitialize() {
    return new Promise(async (resolve, reject) => {
        try {
            await Nekretnina.create({
                tip_nekretnine: 'Stan',
                naziv: 'Stan 1',
                kvadratura: 50,
                cijena: 100000,
                tip_grijanja: 'Centralno',
                lokacija: 'Sarajevo',
                godina_izgradnje: 2010,
                datum_objave: new Date(),
                opis: 'Opis stana 1',
                pretrage: 0,
                klikovi: 0
            });

            await Nekretnina.create({
                tip_nekretnine: 'Stan',
                naziv: 'Stan 2',
                kvadratura: 150,
                cijena: 500000,
                tip_grijanja: 'Plin',
                lokacija: 'Zenica',
                godina_izgradnje: 2018,
                datum_objave: new Date(),
                opis: 'Opis stana 2',
                pretrage: 0,
                klikovi: 0
            });

            await Nekretnina.create({
                tip_nekretnine: 'Stan',
                naziv: 'Stan 3',
                kvadratura: 300,
                cijena: 1500000,
                tip_grijanja: 'Plin',
                lokacija: 'Sarajevo',
                godina_izgradnje: 2022,
                datum_objave: new Date(),
                opis: 'Opis stana 3',
                pretrage: 0,
                klikovi: 0
            });

            await Nekretnina.create({
                tip_nekretnine: 'Kuca',
                naziv: 'Kuca 1',
                kvadratura: 220,
                cijena: 1000000,
                tip_grijanja: 'Plin',
                lokacija: 'Sarajevo',
                godina_izgradnje: 2016,
                datum_objave: new Date(),
                opis: 'Opis kuce 1',
                pretrage: 0,
                klikovi: 0
            });

            await Nekretnina.create({
                tip_nekretnine: 'Poslovni prostor',
                naziv: 'Poslovni prostor 1',
                kvadratura: 50,
                cijena: 200000,
                tip_grijanja: 'Plin',
                lokacija: 'Sarajevo',
                godina_izgradnje: 2010,
                datum_objave: new Date(),
                opis: 'Opis pp 1',
                pretrage: 0,
                klikovi: 0
            });

            await Korisnik.create({
                ime: 'Ime 1',
                prezime: 'Prezime 1',
                username: 'username1',
                password: '$2b$10$85NPVhw4HfTEHbCz4qMHguu6O0AFBZQNwlS17bSp4wUj/zbo2jwyq' // password
            });

            await Upit.create({
                korisnik_id: 1,
                tekst_upita: 'Tekst upita 1 za nekretninu 1',
                nekretnina_id: 1
            });

            await Upit.create({
                korisnik_id: 1,
                tekst_upita: 'Tekst upita 2 za nekretninu 1',
                nekretnina_id: 1
            });

            await Upit.create({
                korisnik_id: 1,
                tekst_upita: 'Tekst upita 1 za nekretninu 2',
                nekretnina_id: 2
            });

            await Upit.create({
                korisnik_id: 1,
                tekst_upita: 'Tekst upita 2 za nekretninu 2',
                nekretnina_id: 2
            });
        } catch (error) {
            reject(`Neuspješna inicijalizacija podataka: ${error.message}`);
        }
    });
}