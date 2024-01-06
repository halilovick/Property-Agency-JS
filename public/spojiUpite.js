document.addEventListener("DOMContentLoaded", function () {
    let loggedInUser = null;

    PoziviAjax.getKorisnik(function (error, data) {
        if (error) {
            console.log(error)
        } else {
            loggedInUser = data;
            const form = document.getElementById("upit_input");
            form.innerHTML = `
            <input type="text" id="tekst_upita">
            <button id="submit-query-button" onclick="posaljiUpit()">Pošalji upit</button>
            `;
        }
    });

    function posaljiUpit() {
        const tekstUpita = document.getElementById("tekst_upita").value;
        const urlSearchParams = new URLSearchParams(window.location.search);
        const nekretninaDetails = Object.fromEntries(urlSearchParams.entries());

        PoziviAjax.postUpit(nekretninaDetails.id, tekstUpita, function (error, data) {
            if (error) {
                console.log(error)
            } else {
                if (!loggedInUser) {
                    return;
                }
                const upitElement = document.createElement("li");
                upitElement.innerHTML = `
                <h4>${loggedInUser.username}</h4>
                <p>${tekstUpita}</p>
                `;
                document.getElementById("upiti-list").appendChild(upitElement);
                const form = document.getElementById("upit_input");
                form.innerHTML = `
            <input type="text" id="tekst_upita">
            <button id="submit-query-button" onclick="posaljiUpit()">Pošalji upit</button>
            `;
            }
        });
    }
});