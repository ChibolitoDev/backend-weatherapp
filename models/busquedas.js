const fs = require('fs');
const axios = require('axios')

class Busquedas {
    historial = [];
    dbPath = './db/database.json'
    constructor() {
        this.readDB();
    };

    get Capitalize() {
        const cap = this.historial.map(place => {
            let words = place.split(' ');
            words = words.map(p => p[0].toUpperCase() + p.substring(1))
            return words.join(' ')
        })
        return cap
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'autocomplete': true,
            'limit': 5,
            'lenguage': 'es'
        }
    }
    async ciudad(lugar = '') {
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get()

            const data = resp.data.features

            return data.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));
        } catch (error) {

            return [];
        }

    }

    get paramsWeather() {
        return {
            appid: process.env.OPEN_WEATHER_MAP_KEY,
            units: 'metrics',
            lang: 'es'

        }
    }

    async cityTemp(lat, lon) {
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    ...this.paramsWeather, lat, lon,
                }
            });

            const resp = await instance.get()
            const { weather, main } = resp.data
            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
        } catch (error) {

            return error;
        }

    }

    addHistory(place = '') {
        if (this.historial.includes(place.toLocaleLowerCase())) {
            return;
        }

        this.historial = this.historial.splice(0, 4);

        this.historial.unshift(place.toLocaleLowerCase());

        this.saveDB();
    }

    saveDB() {
        const payload = {
            historial: this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    readDB() {
        if (!fs.existsSync(this.dbPath)) {
            return;
        }

        const file = fs.readFileSync(this.dbPath, { encoding: 'utf-8' })
        const data = JSON.parse(file);
        this.historial = data.historial;
    }

}

module.exports = Busquedas;