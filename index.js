const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const Korisnik = require('./models/korisnik');
const Nekretnina = require('./models/nekretnina');
const Upit = require('./models/upit');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public', 'html')));
app.use(express.json());

let nizNekretninaTrenutna = [];
let nizNekretninaPrethodni = [];

const db = require('./config/database');
db.sequelize.sync();

app.use(session({
    secret: 'wt19215',
    resave: false,
    saveUninitialized: true
}));

app.get('/css/:file', (req, res) => {
    const file = req.params.file;
    res.sendFile(path.join(__dirname, 'css', file), {
        headers: {
            'Content-Type': 'text/css'
        }
    });
});

app.get('/public/:file', (req, res) => {
    res.type('application/javascript');
    res.sendFile(path.join(__dirname, 'public', req.params.file), {
        headers: {
            'Content-Type': 'text/javascript'
        }
    });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const users = await Korisnik.findAll();
    const user = users.find(u => u.username === username);
    if (user) {
        const compare = await bcrypt.compare(password, user.password);
        if (compare) {
            req.session.username = user.username;
            res.status(200).json({ poruka: 'Uspješna prijava' });
        } else {
            res.status(401).json({ greska: 'Neuspješna prijava' });
        }
    } else {
        res.status(401).json({ greska: 'Neuspješna prijava' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(401).json({ greska: 'Neautorizovan pristup' });
        } else {
            res.status(200).json({ poruka: 'Uspješno ste se odjavili' });
        }
    });
});

app.get('/korisnik', async (req, res) => {
    if (req.session.username) {
        const users = await Korisnik.findAll();
        const loggedInUser = users.find(u => u.username === req.session.username);
        if (loggedInUser) {
            res.status(200).json(loggedInUser);
        } else {
            res.status(401).json({ greska: 'Neautorizovan pristup' });
        }
    } else {
        res.status(401).json({ greska: 'Neautorizovan pristup' });
    }
});

app.post('/upit', async (req, res) => {
    if (req.session.username) {
        const { nekretnina_id, tekst_upita } = req.body;
        const users = await Korisnik.findAll();
        const loggedInUser = users.find(u => u.username === req.session.username);
        const userId = loggedInUser.id;

        const nekretnine = await Nekretnina.findAll();
        const selectedNekretnina = nekretnine.find(n => n.id == nekretnina_id);

        if (!selectedNekretnina) {
            res.status(400).json({ greska: `Nekretnina sa id-em ${nekretnina_id} ne postoji` });
        } else {
            if (!selectedNekretnina.upiti) {
                selectedNekretnina.upiti = [];
            }

            const noviUpit = await Upit.create({ korisnik_id: userId, tekst_upita: tekst_upita, nekretnina_id: nekretnina_id })

            res.status(200).json({ poruka: 'Upit je uspješno dodan' });
        }
    } else {
        res.status(401).json({ greska: 'Neautorizovan pristup' });
    }
});

app.put('/korisnik', async (req, res) => {
    if (req.session.username) {
        const { ime, prezime, username, password } = req.body;

        const users = await Korisnik.findAll();
        const loggedInUser = users.find(u => u.username === req.session.username);
        if (loggedInUser) {
            if (ime) loggedInUser.ime = ime;
            if (prezime) loggedInUser.prezime = prezime;
            if (username) loggedInUser.username = username;
            if (password) {
                const pass = await bcrypt.hash(password, 10)
                loggedInUser.password = pass;
            }
            fs.writeFile('data/korisnici.json', JSON.stringify(users), (err) => {
                if (err) {
                    res.status(500).json({ greska: err.message });
                }
            });
            res.status(200).json({ poruka: 'Podaci su uspješno ažurirani' });
        } else {
            res.status(401).json({ greska: 'Neautorizovan pristup' });
        }
    } else {
        res.status(401).json({ greska: 'Neautorizovan pristup' });
    }
});

app.get('/nekretnine', async (req, res) => {
    try {
        const nekretnine = await Nekretnina.findAll();
        nekretnine.map(item => {
            if (!nizNekretninaTrenutna.find(obj => obj.nekretninaId == item.id))
                nizNekretninaTrenutna.push({ nekretninaId: item.id, klikovi: item.klikovi, pretrage: item.pretrage });
        });
        nizNekretninaPrethodni = deepCopyArray(nizNekretninaTrenutna);
        res.status(200).json(nekretnine);
    } catch (error) {
        console.error(error);
        res.status(500).json({ greska: error.message });
    }
});

app.get('/nekretnina/:id', async (req, res) => {
    const nekretninaId = parseInt(req.params.id);
    if (!nekretninaId) {
        return res.status(400).json({ greska: `Nekretnina sa id-em ${nekretninaId} ne postoji` });
    }
    const trazenaNekretnina = await Nekretnina.findByPk(nekretninaId, {
        include: [
            {
                model: Upit,
                as: 'upiti',
                include: { model: Korisnik, attributes: ['username'] }
            }
        ]
    });

    if (!trazenaNekretnina) {
        return res.status(400).json({ greska: `Nekretnina sa id-em ${nekretninaId} ne postoji` });
    }

    res.status(200).json(trazenaNekretnina);
});

app.post('/marketing/nekretnine', (req, res) => {
    const body = req.body;
    console.log(body);
    if (nizNekretninaTrenutna.length == 0) {
        nizNekretninaPrethodni = deepCopyArray(nizNekretninaTrenutna);
        nizNekretninaTrenutna = body.nizNekretnina.map(id => {
            return { nekretninaId: id, klikovi: 1, pretrage: 1 };
        });
    } else {
        nizNekretninaPrethodni = deepCopyArray(nizNekretninaTrenutna);
        body.nizNekretnina.forEach(async id => {
            const item = nizNekretninaTrenutna.find(item => item.nekretninaId === id);
            const nekretnina = await Nekretnina.findByPk(id);
            await Nekretnina.update({ pretrage: nekretnina.pretrage + 1 }, { where: { id: id } });
            if (item) {
                item.pretrage++;
            } else {
                nizNekretninaTrenutna.push({ nekretninaId: id, klikovi: 1, pretrage: 1 });
            }
        });
    }
    res.status(200).send();
});

app.post('/marketing/nekretnina/:id', async (req, res) => {
    const id = req.params.id;
    try {
        nizNekretninaPrethodni = deepCopyArray(nizNekretninaTrenutna);
        const nekretnina = await Nekretnina.findByPk(id);
        if (!nekretnina) {
            return res.status(400).json({ greska: `Nekretnina sa id-em ${id} ne postoji` });
        }
        await Nekretnina.update({ klikovi: nekretnina.klikovi + 1 }, { where: { id: id } });
        const item = nizNekretninaTrenutna.find(item => item.nekretninaId == id);
        if (item) {
            item.klikovi++;
        }
        res.status(200).send();
    } catch (error) {
        console.error('Greška prilikom povećanja broja klikova:', error);
        res.status(500).json({ greska: 'Greška prilikom povećanja broja klikova.' });
    }
});

app.post('/marketing/osvjezi', (req, res) => {
    let nizPromjenjenih = [];
    if (nizNekretninaTrenutna.length == 0 && req.body.nizNekretnina !== undefined) { // prazan pocetni niz, ima body
        nizPromjenjenih = req.body.nizNekretnina;
    } else if (req.body.nizNekretnina !== undefined) { // ima body
        let noviNiz = req.body.nizNekretnina;
        noviNiz = noviNiz.map(id => {
            return parseInt(id);
        });
        if (noviNiz.length == 1) {
            req.session.osvjeziJednog = noviNiz[0];
        } else {
            req.session.osvjeziJednog = null;
        }
        nizNekretninaTrenutna.forEach(obj1 => {
            if (obj1.nekretninaId !== undefined && noviNiz.includes(obj1.nekretninaId)) {
                nizPromjenjenih.push(obj1);
            }
        })
    } else if (req.session.osvjeziJednog == null) { // nema body, ne osvjezava jednog
        nizPromjenjenih = nadjiPromjene(nizNekretninaPrethodni, nizNekretninaTrenutna);
        nizNekretninaPrethodni = deepCopyArray(nizNekretninaTrenutna);
    } else if (req.session.osvjeziJednog != null) { // nema body, osvjezava jednog
        let indeks = req.session.osvjeziJednog;
        let changedObject = null;
        nizNekretninaTrenutna.forEach(obj1 => {
            if (obj1.nekretninaId !== undefined && indeks == obj1.nekretninaId) {
                nizPromjenjenih.push(obj1);
                changedObject = obj1;
            }
        })
        let oldObject = nizNekretninaPrethodni.find(item => item.nekretninaId == changedObject.nekretninaId);
        if (oldObject.klikovi == changedObject.klikovi && oldObject.pretrage == changedObject.pretrage) {
            nizPromjenjenih = [];
        } else {
            nizNekretninaPrethodni = deepCopyArray(nizNekretninaTrenutna);
        }
    }
    res.status(200).send(nizPromjenjenih);
});

app.listen(port, () => {
    console.log(`Server sluša na http://localhost:${port}`);
});

function nadjiPromjene(stariNiz, noviNiz) {
    const changes = [];

    noviNiz.forEach((noviItem) => {
        const stariItem = stariNiz.find((obj) => obj.nekretninaId == noviItem.nekretninaId);
        if (stariItem && (stariItem.klikovi != noviItem.klikovi || stariItem.pretrage != noviItem.pretrage)) {
            changes.push({
                nekretninaId: noviItem.nekretninaId,
                klikovi: noviItem.klikovi,
                pretrage: noviItem.pretrage
            })
        }
        if (!stariItem) {
            changes.push({
                nekretninaId: noviItem.nekretninaId,
                klikovi: noviItem.klikovi,
                pretrage: noviItem.pretrage
            })
        }
    });
    return changes;
}

function deepCopyArray(arr) {
    return JSON.parse(JSON.stringify(arr));
}