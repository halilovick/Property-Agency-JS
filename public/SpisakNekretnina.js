let SpisakNekretnina = function () {
    let listaNekretnina = [];
    let listaKorisnika = [];

    let init = function (listaNek, listaKor) {
        listaNekretnina = listaNek;
        listaKorisnika = listaKor;
    }

    let filtrirajNekretnine = function (kriterij) {
        if (!kriterij || Object.keys(kriterij).length === 0) {
            return listaNekretnina;
        }

        const filtriraneNekretnine = listaNekretnina.filter(nekretnina => {
            if (kriterij.min_kvadratura && nekretnina.kvadratura < kriterij.min_kvadratura) {
                return false;
            }
            if (kriterij.max_kvadratura && nekretnina.kvadratura > kriterij.max_kvadratura) {
                return false;
            }
            if (kriterij.min_cijena && nekretnina.cijena < kriterij.min_cijena) {
                return false;
            }
            if (kriterij.max_cijena && nekretnina.cijena > kriterij.max_cijena) {
                return false;
            }
            if (kriterij.tip_nekretnine && nekretnina.tip_nekretnine !== kriterij.tip_nekretnine) {
                return false;
            }
            return true;
        });

        return filtriraneNekretnine;
    }

    let ucitajDetaljeNekretnine = function (id) {
        const nekretnina = listaNekretnina.find(nekretnina => nekretnina.id === id);
        return nekretnina || null;
    }

    return {
        init: init,
        filtrirajNekretnine: filtrirajNekretnine,
        ucitajDetaljeNekretnine: ucitajDetaljeNekretnine
    }
};