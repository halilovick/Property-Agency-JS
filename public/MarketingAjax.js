const MarketingAjax = (() => {
    let prviPut = true;
    let osvjeziTrenutnu = false;
    let ids = [];

    const novoFiltriranje = (listaFiltriranihNekretnina) => {
        const ids = listaFiltriranihNekretnina.map(obj => obj.id);
        fetch('/marketing/nekretnine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify({ nizNekretnina: ids })
        }).then((response) => {
            prviPut = true;
        }).then((error) => {
            console.log(error);
        });
    }

    const osvjeziPretrage = (divNekretnine) => {
        if (!osvjeziTrenutnu) {
            const gridItems = divNekretnine.querySelectorAll('.grid-item');
            ids = Array.from(gridItems).map(item => item.id);
        }
        if (prviPut || osvjeziTrenutnu) {
            fetch('/marketing/osvjezi', {
                method: 'POST',
                heade   rs: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify({ nizNekretnina: ids })
            }).then((response) => {
                prviPut = false;
                osvjeziTrenutnu = false;
                return response.json();
            }).then((data) => {
                data.forEach(nekretnina => {
                    const nekretninaId = nekretnina.nekretninaId;
                    const pretragaValue = nekretnina.pretrage;
                    const pretrageElement = divNekretnine.querySelectorAll(`#pretrage-${nekretninaId}`)[0]
                    if (pretrageElement) pretrageElement.innerHTML = `<p>Pretrage: ${pretragaValue}</p>`;
                })
            });
        } else {
            fetch('/marketing/osvjezi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then((response) => {
                return response.json();
            }).then((data) => {
                data.forEach(nekretnina => {
                    const nekretninaId = nekretnina.nekretninaId;
                    const pretragaValue = nekretnina.pretrage;
                    const pretrageElement = divNekretnine.querySelectorAll(`#pretrage-${nekretninaId}`)[0]
                    if (pretrageElement) pretrageElement.innerHTML = `<p>Pretrage: ${pretragaValue}</p>`;
                })
            });
        }
    };

    const osvjeziKlikove = (divNekretnine) => {
        if (!osvjeziTrenutnu) {
            const gridItems = divNekretnine.querySelectorAll('.grid-item');
            ids = Array.from(gridItems).map(item => item.id);
        }
        if (prviPut || osvjeziTrenutnu) {
            fetch('/marketing/osvjezi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify({ nizNekretnina: ids })
            }).then((response) => {
                prviPut = false;
                osvjeziTrenutnu = false;
                return response.json();
            }).then((data) => {
                //console.log(data);
                data.forEach(nekretnina => {
                    const nekretninaId = nekretnina.nekretninaId;
                    const klikoviValue = nekretnina.klikovi;
                    const klikoviElement = divNekretnine.querySelectorAll(`#klikovi-${nekretninaId}`)[0];
                    if (klikoviElement) klikoviElement.innerHTML = `<p>Klikovi: ${klikoviValue}</p>`;
                })
            });
        } else {
            fetch('/marketing/osvjezi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then((response) => {
                return response.json();
            }).then((data) => {
                //console.log(data);
                data.forEach(nekretnina => {
                    const nekretninaId = nekretnina.nekretninaId;
                    const klikoviValue = nekretnina.klikovi;
                    const klikoviElement = divNekretnine.querySelectorAll(`#klikovi-${nekretninaId}`)[0];
                    if (klikoviElement) klikoviElement.innerHTML = `<p>Klikovi: ${klikoviValue}</p>`;
                })
            });
        }
    };

    const klikNekretnina = (idNekretnine) => {
        fetch(`/marketing/nekretnina/${idNekretnine}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }, body: JSON.stringify({})
        }).then((response) => {
            prviPut = true;
            osvjeziTrenutnu = true;
            ids = [idNekretnine];
        });
    };

    return {
        osvjeziPretrage,
        osvjeziKlikove,
        novoFiltriranje,
        klikNekretnina
    };
})();