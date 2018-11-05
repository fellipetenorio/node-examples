const request = require('request');
const axios = require('axios');

var address = (key, url, callback) => {
    request({
        url,
        json: true
    }, (error, response, body) => {
        requesSanitize(error, response, body, (err) => {
            console.log(err);
            return;
        });
        
        callback(null, body);
    });
}

var weather = (key, lat, lng, callback) => {
    request({
        url: `https://api.darksky.net/forecast/${key}/${lat},${lng}?lang=pt&units=si`,
    }, (error, response, body) => {
        if(error)
            callback(error);
        else if(response.statusCode !== 200)
            callback(`problem in Forecast.io server. HTTP ${response.statusCode}`)
        else
            callback(undefined, JSON.parse(body));
    });
};

var requesSanitize = (error, response, body, callback) => {
    if(error) {
        callback(error);
    } else if(body.error_message) {
        callback(body.error_message, null);
    } else if(body.status === 'ZERO_RESULTS') {
        callback('Unbale to find that address');
    } else if(body.status !== 'OK') {
        callback('Request problems');
    }
};

var weatherAsync = (googleKey, skyKey, address) => {
    return new Promise((resolve, reject) => {
        var url = `https://maps.googleapis.com/maps/api/geocode/json?key=${googleKey}&address=${encodeURIComponent(address)}`;
        request({
            url,
            json: true
        }, (error, response, body) => {
            requesSanitize(error, response, body, (err) => reject(err));
            var location = body.results[0].geometry.location;
            request({
                url: `https://api.darksky.net/forecast/${skyKey}/${location.lat},${location.lng}?lang=pt&units=si`,
            }, (error, response, body) => {
                if(error)
                    reject(error);
                else if(response.statusCode !== 200)
                    reject(`problem in Forecast.io server. HTTP ${response.statusCode}`)
                else
                    resolve(JSON.parse(body));
            });
        });
    });
}

var weatherAxios = (googleKey, skyKey, address) => {
    var url = `https://maps.googleapis.com/maps/api/geocode/json?key=${googleKey}&address=${encodeURIComponent(address)}`;

    return axios.get(url)
        .then(response => {
            if(response.data.error_message)
                throw new Error(response.data.error_message);
            var location = response.data.results[0].geometry.location;
            var urlSky = `https://api.darksky.net/forecast/${skyKey}/${location.lat},${location.lng}?lang=pt&units=si`;
            return axios.get(urlSky);
        })
        .then(response => response.data);
}

module.exports = {
    address,
    weather,
    weatherAsync,
    weatherAxios
}