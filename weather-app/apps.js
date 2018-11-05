const yargs = require('yargs');
const geocode = require('./geocode/geocode.js');

const argv = yargs
    .options({
        a: {
            demand: true,
            alias: 'address',
            describe: 'Address to fetch weather for',
            string: true
        },
        googlekey: {
            demand: true,
            alias: 'g',
            describe: 'Google Maps API Key',
            string: true
        },
        skykey: {
            demand: true,
            alias: 's',
            describe: 'Dark Sky API Key',
            string: true
        },

    })
    .help()
    .alias('help', 'h')
    .argv;

const key = argv.g;
const skyKey = argv.s;
const address = argv.a;
var url = `https://maps.googleapis.com/maps/api/geocode/json?key=${key}&address=${encodeURIComponent(address)}`;

/*
geocode.address(key, url, (error, body) => {
    if(error) {
        console.log(error);
        return;
    }
    var location = body.results[0].geometry.location;
    geocode.weather(skyKey, location.lat, location.lng, (error, res) => {
        if(error) {
            console.log(error);
            return;
        }
        console.log(typeof res);
        console.log(`${res.currently.summary}. ${res.currently.temperature}C.`, 
        `(${body.results[0].formatted_address}, (${location.lat}, ${location.lng}))`);
    });
});
*/
/*
geocode.weatherAsync(key, skyKey, address)
    .then(res => console.log(`${res.currently.summary}. ${res.currently.temperature}C.`))
    .catch(err => console.log('err', err));
*/
geocode.weatherAxios(key, skyKey, address)
    .then(res => console.log(`${res.currently.summary}. ${res.currently.temperature}C.`))
    .catch(err => console.log('err', err));