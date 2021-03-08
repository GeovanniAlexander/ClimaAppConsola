const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

class Busqueda{

    historial = [];
    dbPath = "./db/db.json"

    constructor(){
        this.leerBd();
    }

    get historialCap(){
        return this.historial.map( lugar => {
            let words = lugar.split(' ');
            return words.map( word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        });
    }

    get paramMapBox(){
        return {
            "access_token": process.env.MAPBOX_KEY,
            "limit": 5,
            "language": "es"
        }
    }

    get paramWeatherMap(){
        return {
            "units": "metric",
            "lang": "es",
            "appid":process.env.OPENWEATHER_KEY
        }
    }

    async ciudad(lugar) {


        try {
            //pet http api
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramMapBox
            })
            const resp = await instance.get();

            return resp.data.features.map( i => ({
                id: i.id,
                nombre: i.place_name_es,
                lng: i.center[0],
                lat: i.center[1]
            })); 

        } catch (error) {
            return []; //retorna arreglo vacio ya que no encontro nada
        }
    } 

    async clima( lat, lon ){

        try {
            const instance = axios.create({
                baseURL: "http://api.openweathermap.org/data/2.5/weather",
                params: {...this.paramWeatherMap, lat, lon}
            })
            const resp = await instance.get(); 
            const {main, weather} = resp.data;
        
            return{
                desc: weather[0].description,
                temp: main.temp,
                min: main.temp_min,
                max: main.temp_max
            }
        } catch (error) {
            console.log(error);
        }
    }

    guardar(lugar = ""){

        if( this.historial.includes( lugar.toLocaleLowerCase() )) 
            return;              
        
        this.historial = this.historial.splice(0,5);
        this.historial.unshift(lugar.toLocaleLowerCase());

        this.guardarDb();
    }

    guardarDb (){
        
        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerBd(){
        if(!fs.existsSync(this.dbPath)) return;

        const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
        const data = JSON.parse(info);
        this.historial = data.historial.splice(0,5);
    }
}

module.exports = Busqueda;