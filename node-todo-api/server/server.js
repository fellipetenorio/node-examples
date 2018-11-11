var express = require('express');
var bodyParser = require('body-parser');

var {ObjectID} = require('mongodb');
var {mongoose} = require( './db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
app.use(bodyParser.json());

app.get('/todos', (req, res) => {
    console.log('list all todos');
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

// GET user by id
app.get('/todos/:id', (req, res) => {
    var todoId = req.params.id;
    // should not acc
    if(!ObjectID.isValid(todoId)) {
        return res.status(400).send({
            message: 'invalid object id'
        });
    }
    Todo.findById(todoId).then(todo => {
        return res.send({
            todo
        });
    });
});

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