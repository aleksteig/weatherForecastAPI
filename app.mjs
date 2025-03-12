import fetch from "node-fetch";

const requestURL = "https://api.met.no/weatherapi/locationforecast/2.0/compact"
const locations = {
    Grimstad: gisEncode(58.33, 8.58),
    Moscow: gisEncode(55.79, 37.62),
}

let location = "Moscow";

if(process.argv[2] == "--location"){
    location = process.argv[3];
}

if(!locations[location]){
    console.log("This place doesn't exist");
    process.exit(-1);
}

console.log("Getting the weather for " + location);

async function getWeatherForLocation(coordinates){

    try {
        const request = {
            headers: {
                "User-Agent":"aleks",
                "Content-Type": "application/json",
            }
        }

        let response = await fetch(createRequestURL(coordinates), request);
        if(!response.ok){
            throw new Error("Http shit happened " + response.status);
        }

        const weatherData = await response.json();
        return weatherData;

    } catch (error){
        console.error(error);
        throw (error);
    }

}

const weatherForecast = await getWeatherForLocation(locations.Grimstad);

console.dir(weatherForecast.properties.timeseries[1].data.next_6_hours.summary.symbol_code);

//#region Utility functions

function createRequestURL(coordinates){
    return `${requestURL}?lat=${coordinates.lat}&lon=${coordinates.lon}`
}


function gisEncode(lat,lon){
    return { lat, lon } 
}


//#endregion

//#region unit Tests
const received = gisEncode(1, 2);
const expected = { lat: 1, lon: 2 };
if(JSON.stringify(received) === JSON.stringify(expected)){
    console.log("Gis encode parses");
} else {
    console.log("Gis encode fails");
}