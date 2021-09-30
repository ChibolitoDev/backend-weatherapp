require('dotenv').config();
const { inquirerMenu, pausa, leerInput, listPlaces } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
    const searcher = new Busquedas();
    let opt;
    do {
        opt = await inquirerMenu();
        switch (opt) {
            case 1:
                const place = await leerInput('Ciudad: ');
                const search = await searcher.ciudad(place)
                const searchedId = await listPlaces(search);
                if (searchedId === '0') continue;
                const searchedPlace = search.find(l => l.id === searchedId);
                searcher.addHistory(searchedPlace.nombre);
                const weather = await searcher.cityTemp(searchedPlace.lat, searchedPlace.lng);
                console.clear();
                console.log(`\n Informacion de la cuidad \n`.green)
                console.log(`Ciudad :${searchedPlace.nombre.green}`)
                console.log(`Latitud :${searchedPlace.lat}`)
                console.log(`Longitud :${searchedPlace.lng}`)
                console.log(`Temperatura :${weather.temp}`)
                console.log(`Temperatura minima :${weather.min}`)
                console.log(`Temperatura maxima :${weather.max}`)
                console.log(`Como esta el clima :${weather.desc.green}`)
                break;
            case 2:
                searcher.Capitalize.forEach((place, index) => {
                    const idx = `${index + 1}.`.green
                    console.log(`${idx} ${place}`)
                })
                break

            case 0:
                break
        }
        await pausa();
    } while (opt != 0);
}

main();