const PoziviAjax = (() => {
    const baseUrl = 'http://localhost:3000';

    function impl_getKorisnik(fnCallback) {
        fetch(`${baseUrl}/korisnik`)
            .then(response => {
                if (!response.ok) {
                    const error = { message: response.statusText };
                    return fnCallback(error, null);
                }

                response.json()
                    .then(data => fnCallback(null, data))
                    .catch(error => fnCallback(error, null));
            })
            .catch(error => fnCallback(error, null));
    }

    function impl_putKorisnik(noviPodaci, fnCallback) {
        fetch(`${baseUrl}/korisnik`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(noviPodaci),
        })
            .then(response => {
                if (!response.ok) {
                    const error = { message: response.statusText };
                    return fnCallback(error, null);
                }

                response.json()
                    .then(data => fnCallback(null, data))
                    .catch(error => fnCallback(error, null));
            })
            .catch(error => fnCallback(error, null));
    }

    function impl_postUpit(nekretnina_id, tekst_upita, fnCallback) {
        fetch(`${baseUrl}/upit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nekretnina_id, tekst_upita }),
        })
            .then(response => {
                if (!response.ok) {
                    const error = { message: response.statusText };
                    return fnCallback(error, null);
                }

                response.json()
                    .then(data => fnCallback(null, data))
                    .catch(error => fnCallback(error, null));
            })
            .catch(error => fnCallback(error, null));
    }

    function impl_getNekretnine(fnCallback) {
        fetch(`${baseUrl}/nekretnine`)
            .then(response => {
                if (!response.ok) {
                    const error = { message: response.statusText };
                    return fnCallback(error, null);
                }

                response.json()
                    .then(data => fnCallback(null, data))
                    .catch(error => fnCallback(error, null));
            })
            .catch(error => fnCallback(error, null));
    }

    function impl_postLogin(username, password, fnCallback) {
        fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        })
            .then(response => {
                if (!response.ok) {
                    const error = { message: response.statusText };
                    return fnCallback(error, null);
                }

                response.json()
                    .then(data => fnCallback(null, data))
                    .catch(error => fnCallback(error, null));
            })
            .catch(error => fnCallback(error, null));
    }

    function impl_postLogout(fnCallback) {
        fetch(`${baseUrl}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    const error = { message: response.statusText };
                    return fnCallback(error, null);
                }

                response.json()
                    .then(data => fnCallback(null, data))
                    .catch(error => fnCallback(error, null));
            })
            .catch(error => fnCallback(error, null));
    }

    return {
        postLogin: impl_postLogin,
        postLogout: impl_postLogout,
        getKorisnik: impl_getKorisnik,
        putKorisnik: impl_putKorisnik,
        postUpit: impl_postUpit,
        getNekretnine: impl_getNekretnine,
    };
})();