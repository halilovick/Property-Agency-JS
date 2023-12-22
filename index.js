const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public', 'html')));
app.use(express.json());

let nizNekretninaTrenutna = [];

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

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    fs.readFile('data/korisnici.json', 'utf-8', (err, data) => {
        if (err) {
            res.status(400).json({ greska: err.message });
        } else {
            const users = JSON.parse(data.toString('utf8'));
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                req.session.username = user.username;
                res.status(200).json({ poruka: 'Uspješna prijava' });
            } else {
                res.status(401).json({ greska: 'Neuspješna prijava' });
            }
        }
    });
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

app.get('/korisnik', (req, res) => {
    if (req.session.username) {
        fs.readFile('data/korisnici.json', 'utf-8', (err, data) => {
            if (err) {
                res.status(500).json({ greska: err.message });
            } else {
                const users = JSON.parse(data.toString('utf8'));
                const loggedInUser = users.find(u => u.username === req.session.username);

                if (loggedInUser) {
                    res.status(200).json(loggedInUser);
                } else {
                    res.status(401).json({ greska: 'Neautorizovan pristup' });
                }
            }
        });
    } else {
        res.status(401).json({ greska: 'Neautorizovan pristup' });
    }
});

app.post('/upit', (req, res) => {
    if (req.session.username) {
        const { nekretnina_id, tekst_upita } = req.body;
        fs.readFile('data/korisnici.json', (err, data) => {
            if (err) {
                res.status(500).json({ greska: err.message });
            } else {
                const users = JSON.parse(data.toString('utf8'));
                fs.readFile('data/nekretnine.json', (err, data) => {
                    if (err) {
                        res.status(500).json({ greska: err.message });
                    } else {
                        const nekretnine = JSON.parse(data.toString('utf8'));
                        const loggedInUser = users.find(u => u.username === req.session.username);
                        const selectedNekretnina = nekretnine.find(n => n.id === nekretnina_id);

                        if (!selectedNekretnina) {
                            res.status(400).json({ greska: `Nekretnina sa id-em ${nekretnina_id} ne postoji` });
                        } else {
                            if (!selectedNekretnina.upiti) {
                                selectedNekretnina.upiti = [];
                            }

                            const noviUpit = { korisnik_id: loggedInUser.id, tekst_upita: tekst_upita };
                            selectedNekretnina.upiti.push(noviUpit);

                            fs.writeFile('data/nekretnine.json', JSON.stringify(nekretnine), (err) => {
                                console.log(err);
                            });

                            res.status(200).json({ poruka: 'Upit je uspješno dodan' });
                        }
                    }
                });
            }
        });
    } else {
        res.status(401).json({ greska: 'Neautorizovan pristup' });
    }
});

app.put('/korisnik', (req, res) => {
    if (req.session.username) {
        const { ime, prezime, username, password } = req.body;
        fs.readFile('data/korisnici.json', (err, data) => {
            if (err) {
                res.status(500).json({ greska: err.message });
            } else {
                const users = JSON.parse(data.toString('utf8'));
                const loggedInUser = users.find(u => u.username === req.session.username);

                if (loggedInUser) {
                    if (ime) loggedInUser.ime = ime;
                    if (prezime) loggedInUser.prezime = prezime;
                    if (username) loggedInUser.username = username;
                    if (password) loggedInUser.password = password;

                    fs.writeFile('data/korisnici.json', JSON.stringify(users), (err) => {
                        if (err) {
                            res.status(500).json({ greska: err.message });
                        }
                    });

                    res.status(200).json({ poruka: 'Podaci su uspješno ažurirani' });
                } else {
                    res.status(401).json({ greska: 'Neautorizovan pristup' });
                }
            }
        });
    } else {
        res.status(401).json({ greska: 'Neautorizovan pristup' });
    }
});

app.get('/nekretnine', (req, res) => {
    fs.readFile('data/nekretnine.json', (err, data) => {
        if (err) {
            res.status(500).json({ greska: err.message });
        } else {
            body = JSON.parse(data.toString('utf8'));
            body.map(item => {
                if (!nizNekretninaTrenutna.find(obj => obj.nekretninaId == item.id))
                    nizNekretninaTrenutna.push({ nekretninaId: item.id, klikovi: 0, pretrage: 0 });
            });
            res.status(200).json(JSON.parse(data.toString('utf8')));
        }
    });
});

app.post('/marketing/nekretnine', (req, res) => {
    const body = req.body;
    if (nizNekretninaTrenutna.length == 0) {
        nizNekretninaTrenutna = body.nizNekretnina.map(id => {
            return { nekretninaId: id, klikovi: 1, pretrage: 1 };
        });
    } else {
        body.nizNekretnina.forEach(id => {
            const item = nizNekretninaTrenutna.find(item => item.nekretninaId === id);
            if (item) {
                item.pretrage++;
            } else {
                nizNekretninaTrenutna.push({ nekretninaId: id, klikovi: 1, pretrage: 1 });
            }
        });
    }
    //console.log("/marketing/nekretnine");
    //console.log(nizNekretnina)
    res.status(200).send();
});

app.post('/marketing/nekretnina/:id', (req, res) => {
    const id = req.params.id;
    const item = nizNekretninaTrenutna.find(item => item.nekretninaId == id);
    if (item) {
        item.klikovi++;
        //console.log("/marketing/nekretnina/:id");
        //console.log(item);
        res.status(200).send();
    } else {
        res.status(400).json({ greska: `Nekretnina sa id-em ${id} ne postoji` });
    }
    //console.log(nizNekretninaTrenutna);
});

app.post('/marketing/osvjezi', (req, res) => {
    let nizPromjenjenih = [];
    /*if (req.session.osvjeziJednog != null) {
        let indeks = req.session.osvjeziJednog;
        nizNekretninaTrenutna.forEach(obj1 => {
            if (obj1.nekretninaId !== undefined && indeks == obj1.nekretninaId) {
                nizPromjenjenih.push(obj1);
            }
        })
        console.log(nizPromjenjenih);
    }*/
    if (nizNekretninaTrenutna.length == 0 && req.body.nizNekretnina !== undefined) {
        nizPromjenjenih = req.body.nizNekretnina;
    } else if (req.body.nizNekretnina !== undefined) {
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
    } else if(req.session.osvjeziJednog == null) {
        nizPromjenjenih = nizNekretninaTrenutna;
    }

    if (req.session.osvjeziJednog != null) {
        let indeks = req.session.osvjeziJednog;
        nizNekretninaTrenutna.forEach(obj1 => {
            if (obj1.nekretninaId !== undefined && indeks == obj1.nekretninaId) {
                nizPromjenjenih.push(obj1);
            }
        })
    }

    //console.log("nizpromjenjih: ", nizPromjenjenih);
    //console.log("/marketing/osvjezi");
    res.status(200).send(nizPromjenjenih);
});

app.listen(port, () => {
    console.log(`Server sluša na http://localhost:${port}`);
});

