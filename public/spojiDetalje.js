document.addEventListener("DOMContentLoaded", function () {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const nekretninaDetails = Object.fromEntries(urlSearchParams.entries());

    const date = new Date(nekretninaDetails.datum_objave);
    document.getElementById("naziv").innerHTML = `<b>Naziv:</b> ${nekretninaDetails.naziv}`;
    document.getElementById("kvadratura").innerHTML = `<b>Kvadratura:</b> ${nekretninaDetails.kvadratura} m2`;
    document.getElementById("cijena").innerHTML = `<b>Cijena:</b> ${nekretninaDetails.cijena} KM`;
    document.getElementById("tip_grijanja").innerHTML = `<b>Tip grijanja:</b> ${nekretninaDetails.tip_grijanja}`;
    document.getElementById("godina_izgradnje").innerHTML = `<b>Godina izgradnje:</b> ${nekretninaDetails.godina_izgradnje}`;
    document.getElementById("lokacija").innerHTML = `<b>Lokacija:</b> ${nekretninaDetails.lokacija}`;
    document.getElementById("datum_objave").innerHTML = `<b>Datum objave:</b> ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    document.getElementById("opis").innerHTML = `<b>Opis:</b> ${nekretninaDetails.opis}`;
    document.getElementById("upiti-list").innerHTML = ``;
    const upitiArray = JSON.parse(nekretninaDetails.upiti);
    upitiArray.forEach(upit => {
        PoziviAjax.getKorisnikById(upit.korisnik_id, function (error, data) {
            const upitElement = document.createElement("li");
            upitElement.innerHTML = `
            <h4>${data.username}</h4>
            <p>${upit.tekst_upita}</p>
            `;
            document.getElementById("upiti-list").appendChild(upitElement);
        });
    });
});