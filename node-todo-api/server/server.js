var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require( './db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
app.use(bodyParser.json());

app.get('/todos', (req, res) => {
    Todo.find()
    .then(todos => {
        res.send({
            todos
        });
    }, e => {
        res.status(400).send(e);
    })

});

app.post('/todos', (req, res) => {
    var newTodo = new Todo({
        text: req.body.text
    });
    newTodo.save().then(r => 
        res.send(r),
    err => {
        res.status(400).send(err);
    });
});

// app.get('/todos')

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};

// var newTodo = new Todo({
//     text: '    asdf     '
    
// });
// newTodo.save().then(res => console.log('res', res), err => console.log('err', err));

// var newUser = new User({
//     email: 'asdf'
// });
// newUser.save().then(res => console.log('res', res), err => console.log('err', err));