var env = process.env.NODE_ENV || 'development';
console.log('env *****', env);

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {authenticate} = require('./middleware/authenticate');

var { ObjectID } = require('mongodb');
var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var app = express();
app.use(bodyParser.json());

// only call the data from req
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

/*
    USER
*/
app.post('/users', (req, res) => {
    var userData = _.pick(req.body, ['email', 'password']);
    console.log(userData);
    var user = new User(userData);
    
    user.save(user).then(user => {
        return user.generateAuthToken();
    }).then(token => {
        res.header('x-auth', token).send(user);
    })
    .catch(error => {
        res.status(400).send({error});
    });
});
/*
    TODO
*/
// patch todo
app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id))
        return res.status(400).send({ message: 'invalid id' });


    if (!_.isUndefined(body.completed) && !_.isBoolean(body.completed))
        return res.status(400).send({ message: 'completed attribute must be a boolean' });

    if (body.completed)
        body.completedAt = new Date().getTime();

    Todo.findOneAndUpdate(id, { $set: body }, { new: true }).then(todo => {
        res.send({ todo });
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
    if (!ObjectID.isValid(id))
        return res.status(400).send({
            message: 'invalid id'
        });

    return Todo.findByIdAndDelete(id)
        .then(todo => res.send({ todo }), err => {
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
    if (!ObjectID.isValid(todoId)) {
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

module.exports = { app };