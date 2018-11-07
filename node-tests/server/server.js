const express =  require('express');

var app = express();
app.get('/', (req, res) => {
    res.status(404).send({
        error: 'Page not found',
        name: 'Todo App v1.0'
    });
});

// GET /users
app.get('/users', (req, res) => {
    var u1 = {
        name: 'U1',
        age: 34
    };
    var u2 = {
        name: 'U2',
        age: 36
    };
    res.send([u1, u2]);
});
app.listen(3000);
module.exports.app = app;