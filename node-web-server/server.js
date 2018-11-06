const fs = require('fs');
const express = require('express');
const hbs = require('hbs');
// nodemon server.js -e js,hbs
var app = express();

hbs.registerPartials(__dirname+'/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    fs.appendFile('server.log', log+'\n', err => err?console.log(err):true);
    res.render('maintenance.hbs');
    //next(); // allow the page to continue
});

app.use(express.static(__dirname+'/public'));

hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('screamIt', text => text.toUpperCase());

app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'About page',
        currentYear: new Date().getFullYear(),
        message: 'My new server',
        subtitle: 'Do your best'
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About page',
        currentYear: new Date().getFullYear()
    });
});

app.get('/bad', (req, res) => {
    res.send({errorMessage: 'unable do handle request'});
});

app.listen(3000, () => {
    console.log('Server is up at port 3000');
});