var env = process.env.NODE_ENV || 'development';
console.log('env *****', env);

if(env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if(env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

var {ObjectID} = require('mongodb');
var {mongoose} = require( './db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
app.use(bodyParser.json());

// patch todo
app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);
    
    if(!ObjectID.isValid(id))
        return res.status(400).send({message: 'invalid id'});

        
    if(!_.isUndefined(body.completed) && !_.isBoolean(body.completed))
        return res.status(400).send({message: 'completed attribute must be a boolean'});
    
    if(body.completed)
        body.completedAt = new Date().getTime();
    
    Todo.findOneAndUpdate(id, {$set: body}, {new:true}).then(todo => {
        res.send({todo});
    }, err => {
        console.log(err);
        res.status(400).send({
            message: 'problem to update'
        });
    });
});

// delete
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(400).send({
            message: 'invalid id'
        });
    
    return Todo.findByIdAndDelete(id)
        .then(todo => res.send({todo}), err => {
            res.status(500).send(err);
        })
});

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Started on port ${port}`);
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