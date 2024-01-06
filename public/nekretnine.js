let osvjezavanje;

function spojiNekretnine(divReferenca, instancaModula, kriterij) {
    if (divReferenca == null) return;
    const filtriraneNekretnine = instancaModula.filtrirajNekretnine(kriterij);

    divReferenca.innerHTML = '';
    divReferenca.classList.add('grid');

    filtriraneNekretnine.forEach(nekretnina => {
        const nekretninaElement = document.createElement('div');
        nekretninaElement.classList.add('grid-item');
        nekretninaElement.id = nekretnina.id;
        if (kriterij.tip_nekretnine == "Stan") {
            nekretninaElement.style.backgroundColor = 'white';
        } else if (kriterij.tip_nekretnine == "Kuca") {
            nekretninaElement.style.backgroundColor = 'powderblue';
        } else if (kriterij.tip_nekretnine == "Poslovni prostor") {
            nekretninaElement.style.backgroundColor = 'green';
        }
        nekretninaElement.innerHTML = `
            <img src="https://ontime.ba/wp-content/uploads/2023/08/DJI_0789A-1024x768.jpg" alt="No image found">
            <p>${nekretnina.naziv} / ${nekretnina.lokacija}</p>
            <p>${nekretnina.kvadratura}m2</p>
            <div id="dodatniDetalji">
            <div id="dodatniDetalji-${nekretnina.id}"></div>
            </div>
            <p style="text-align: right;">${nekretnina.cijena} KM</p>
            <div id="dodatniDetalji">
            <div id="pretrage-${nekretnina.id}"></div>
            <div id="klikovi-${nekretnina.id}"></div>
            </div>
            <button type="button" id="detaljiButton-${nekretnina.id}" onclick="detaljiClick(${nekretnina.id})">Detalji</button>
            <button type="button" id="otvoriDetaljeButton-${nekretnina.id}" style="display: none;" onclick="otvoriDetaljeClick(${nekretnina.id})">Otvori detalje</button>

        `;
        divReferenca.appendChild(nekretninaElement);
    });
}

const pretragaButton = document.getElementById("pretragaButton");
pretragaButton.addEventListener("click", (event) => {
    const minCijena = document.getElementById("minCijena").value;
    const maxCijena = document.getElementById("maxCijena").value;
    const minKvadratura = document.getElementById("minKvadratura").value;
    const maxKvadratura = document.getElementById("maxKvadratura").value;

    const kriterijPretrage = {};

    if (minCijena) {
        kriterijPretrage.min_cijena = parseInt(minCijena);
    }

    if (maxCijena) {
        kriterijPretrage.max_cijena = parseInt(maxCijena);
    }

    if (minKvadratura) {
        kriterijPretrage.min_kvadratura = parseInt(minKvadratura);
    }

    if (maxKvadratura) {
        kriterijPretrage.max_kvadratura = parseInt(maxKvadratura);
    }

    PoziviAjax.getNekretnine(function (error, data) {
        if (error) {
            console.log(error);
        } else {
            listaNekretnina = data;

            const nekretnine = SpisakNekretnina();
            nekretnine.init(listaNekretnina, listaKorisnika);

            const filtriranaLista = nekretnine.filtrirajNekretnine(kriterijPretrage);

            const kriterijPretrageStan = kriterijPretrage;
            kriterijPretrageStan.tip_nekretnine = "Stan";
            spojiNekretnine(divStan, nekretnine, kriterijPretrageStan);
            const kriterijPretrageKuca = kriterijPretrage;
            kriterijPretrageKuca.tip_nekretnine = "Kuca";
            spojiNekretnine(divKuca, nekretnine, kriterijPretrageKuca);
            const kriterijPretragePp = kriterijPretrage;
            kriterijPretragePp.tip_nekretnine = "Poslovni prostor";
            spojiNekretnine(divPp, nekretnine, kriterijPretragePp);
            MarketingAjax.novoFiltriranje(filtriranaLista);
            osvjezavanje = true;
        }
    });
});

const divStan = document.getElementById("stan");
const divKuca = document.getElementById("kuca");
const divPp = document.getElementById("pp");
const divNekretnine = document.getElementById("nekretnine");

setInterval(() => {
    if (osvjezavanje) {
        MarketingAjax.osvjeziPretrage(divNekretnine);
        MarketingAjax.osvjeziKlikove(divNekretnine);
    }
}, 500);

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

function detaljiClick(nekretninaId) {
    const nekretninaItems = document.querySelectorAll('.grid-item');
    let bojaNekretnine = "";
    nekretninaItems.forEach(item => {
        if (item.id == nekretninaId) {
            item.style.width = '498px';
            bojaNekretnine = item.style.backgroundColor;
            const divElement = document.getElementById(`dodatniDetalji-${nekretninaId}`);
            divElement.innerHTML = `
                <p>Lokacija: ${listaNekretnina.find(nekretnina => nekretnina.id == nekretninaId).lokacija}</p>
                <p>Godina izgradnje: ${listaNekretnina.find(nekretnina => nekretnina.id == nekretninaId).godina_izgradnje}</p>
            `;
            const detaljiButton = document.getElementById(`detaljiButton-${nekretninaId}`);
            detaljiButton.style.display = 'none';
            const otvoriDetaljeButton = document.getElementById(`otvoriDetaljeButton-${nekretninaId}`);
            otvoriDetaljeButton.style.display = 'block';
        } else {
            item.style.width = '298px';
            const divElement = document.getElementById(`dodatniDetalji-${item.id}`);
            divElement.innerHTML = ``;
            const detaljiButton = document.getElementById(`detaljiButton-${item.id}`);
            detaljiButton.style.display = 'block';
            const otvoriDetaljeButton = document.getElementById(`otvoriDetaljeButton-${item.id}`);
            otvoriDetaljeButton.style.display = 'none';
        }
    });
    if (bojaNekretnine == "white") {
        divStan.style.gridTemplateColumns = "repeat(auto-fit, minmax(500px, 1fr))";
        divKuca.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
        divPp.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
    } else if (bojaNekretnine == "green") {
        divStan.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
        divKuca.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
        divPp.style.gridTemplateColumns = "repeat(auto-fit, minmax(500px, 1fr))";
    } else if (bojaNekretnine == "powderblue") {
        divStan.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
        divKuca.style.gridTemplateColumns = "repeat(auto-fit, minmax(500px, 1fr))";
        divPp.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
    }
    MarketingAjax.klikNekretnina(nekretninaId);
}

function otvoriDetaljeClick(nekretninaId) {
    window.location.href = `/detalji.html?id=${nekretninaId}`;
}

var listaNekretnina = [];
PoziviAjax.getNekretnine(function (error, data) {
    if (error) {
        console.log(error);
    } else {
        listaNekretnina = data;

        const nekretnine = SpisakNekretnina();
        nekretnine.init(listaNekretnina, listaKorisnika);

        spojiNekretnine(divStan, nekretnine, { tip_nekretnine: "Stan" });
        spojiNekretnine(divKuca, nekretnine, { tip_nekretnine: "Kuca" });
        spojiNekretnine(divPp, nekretnine, { tip_nekretnine: "Poslovni prostor" });
        osvjezavanje = true;
    }
});