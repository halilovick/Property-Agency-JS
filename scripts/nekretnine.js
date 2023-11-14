import { SpisakNekretnina } from './SpisakNekretnina.js';

function spojiNekretnine(divReferenca, instancaModula, tip_nekretnine) {
    const filtriraneNekretnine = instancaModula.filtrirajNekretnine({ tip_nekretnine: tip_nekretnine });

    divReferenca.innerHTML = '';
    divReferenca.classList.add('grid');

    filtriraneNekretnine.forEach(nekretnina => {
        const nekretninaElement = document.createElement('div');
        nekretninaElement.classList.add('grid-item');
        if (tip_nekretnine == "Stan") {
            nekretninaElement.style.backgroundColor = 'white';
        } else if (tip_nekretnine == "Kuca") {
            nekretninaElement.style.backgroundColor = 'powderblue';
        } else if (tip_nekretnine == "Poslovni prostor") {
            nekretninaElement.style.backgroundColor = 'green';
        }
        nekretninaElement.innerHTML = `
            <img src="https://ontime.ba/wp-content/uploads/2023/08/DJI_0789A-1024x768.jpg" alt="No image found">
            <p>${nekretnina.naziv} / ${nekretnina.lokacija}</p>
            <p>${nekretnina.kvadratura}m2</p>
            <p style="text-align: right;">${nekretnina.cijena} KM</p>
        `;
        divReferenca.appendChild(nekretninaElement);
    });
}

const divStan = document.getElementById("stan");
const divKuca = document.getElementById("kuca");
const divPp = document.getElementById("pp");

const listaNekretnina = [{
    id: 1,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo",
    kvadratura: 158,
    cijena: 232000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},
{
    id: 2,
    tip_nekretnine: "Poslovni prostor",
    naziv: "Mali poslovni prostor",
    kvadratura: 20,
    cijena: 70000,
    tip_grijanja: "struja",
    lokacija: "Centar",
    godina_izgradnje: 2005,
    datum_objave: "20.08.2023.",
    opis: "Magnis dis parturient montes.",
    upiti: [{
        korisnik_id: 2,
        tekst_upita: "Integer tincidunt."
    }
    ]
},
{
    id: 3,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo 2",
    kvadratura: 58,
    cijena: 232000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},
{
    id: 4,
    tip_nekretnine: "Stan",
    naziv: "Useljiv stan Sarajevo 3",
    kvadratura: 58,
    cijena: 232000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
},
{
    id: 4,
    tip_nekretnine: "Kuca",
    naziv: "Useljiva Kuca Sarajevo",
    kvadratura: 58,
    cijena: 232000,
    tip_grijanja: "plin",
    lokacija: "Novo Sarajevo",
    godina_izgradnje: 2019,
    datum_objave: "01.10.2023.",
    opis: "Sociis natoque penatibus.",
    upiti: [{
        korisnik_id: 1,
        tekst_upita: "Nullam eu pede mollis pretium."
    },
    {
        korisnik_id: 2,
        tekst_upita: "Phasellus viverra nulla."
    }]
}
]

const listaKorisnika = [{
    id: 1,
    ime: "Neko",
    prezime: "Nekic",
    username: "username1",
},
{
    id: 2,
    ime: "Neko2",
    prezime: "Nekic2",
    username: "username2",
}]

const nekretnine = SpisakNekretnina();
nekretnine.init(listaNekretnina, listaKorisnika);

spojiNekretnine(divStan, nekretnine, "Stan");
spojiNekretnine(divKuca, nekretnine, "Kuca");
spojiNekretnine(divPp, nekretnine, "Poslovni prostor");