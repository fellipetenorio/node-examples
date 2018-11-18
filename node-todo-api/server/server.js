require ('./config/config');

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

/*
    USER
*/

app.delete('/users/me/token', authenticate, async (req, res) => {
    // remove user token
    try {
        await req.user.removeToken(req.token);
        res.status(200).send()
    } catch(e) {
        res.status(400).send()
    }
});


app.post('/users/login', async (req, res) => {
    var {email, password} = req.body;

    if (_.isUndefined(email) || _.isUndefined(password))
        return res.status(400).send({ message: 'missing email or password' });
    try {
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch(e) {
        res.status(401).send(e);
    }

    // User.findByCredentials(email, password).then(user => {
    //     return user.generateAuthToken().then(token => {
    //         res.header('x-auth', token).send(user);
    //     });
    // }).catch(e => {
    //     res.status(401).send(e);
    // });
});

// only call the data from req
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users', async (req, res) => {
    var userData = _.pick(req.body, ['email', 'password']);
    var userObj = new User(userData);
    try {
        const user = await userObj.save(userObj);
        const token = await user.generateAuthToken();
        res.header('x-auth', token).send(user);
    } catch (e) {
        res.status(400).send({e});
    }
    // user.save(user).then(user => {
    //     return user.generateAuthToken();
    // }).then(token => {
    //     res.header('x-auth', token).send(user);
    // })
    // .catch(error => {
    //     res.status(400).send({error});
    // });
});

/*
    TODO
*/
// patch todo
app.patch('/todos/:id', async (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id))
        return res.status(400).send({ message: 'invalid id' });


    if (!_.isUndefined(body.completed) && !_.isBoolean(body.completed))
        return res.status(400).send({ message: 'completed attribute must be a boolean' });

    if (body.completed)
        body.completedAt = new Date().getTime();

    try {
        const todo = await Todo.findOneAndUpdate(id, { $set: body }, { new: true });
        res.send({ todo });
    } catch(err) {
        console.log(err);
        res.status(400).send({
            message: 'problem to update'
        });
    }
    // Todo.findOneAndUpdate(id, { $set: body }, { new: true }).then(todo => {
    //     res.send({ todo });
    // }, err => {
    //     console.log(err);
    //     res.status(400).send({
    //         message: 'problem to update'
    //     });
    // });
});

// delete
app.delete('/todos/:id', authenticate, async (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id))
        return res.status(400).send({
            message: 'invalid id'
        });

    // verify ownership
    try {
        const todo = await Todo.findByIdAndCreatorAndDelete(id, req.user._id);
        res.send({todo});
    } catch(e) {
        res.status(400).send({e})
    }
    // return Todo.findByIdAndCreatorAndDelete(id, req.user._id)
    //     .then(todo => res.send({ todo }))
    //     .catch(e => res.status(400).send({e}));
});

app.get('/todos', authenticate, async (req, res) => {
    console.log('list all todos');
    try {
        const todos = await Todo.find({_creator: req.user._id});
        res.send({todos});
    } catch(e) {
        res.status(400).send(e);
    }
    // Todo.find({
    //     _creator: req.user._id
    // }).then(todos => {
    //     res.send({
    //         todos
    //     });
    // }, e => {
    //     res.status(400).send(e);
    // });
});

app.post('/todos', authenticate, async (req, res) => {
    var newTodo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });
    try {
        const r = await newTodo.save();
        res.send(r)
    } catch (e) {
        res.status(400).send(err);
    }
    // newTodo.save().then(r =>
    //     res.send(r),
    //     err => {
    //         res.status(400).send(err);
    //     });
});

// GET user by id
app.get('/todos/:id', authenticate, async (req, res) => {
    var todoId = req.params.id;
    
    // should not acc
    if (!ObjectID.isValid(todoId)) {
        return res.status(400).send({
            message: 'invalid object id'
        });
    }

    try {
        const todo = await Todo.findById(todoId);
        if(!todo || todo._creator.toHexString() !== req.user._id.toHexString())
            return res.send({todo:null});
        res.send({todo});
    } catch (e) {
        res.status(400);
    }
    // Todo.findById(todoId).then(todo => {
    //     if(!todo || todo._creator.toHexString() !== req.user._id.toHexString())
    //         return res.send({todo:null});

    //     return res.send({
    //         todo
    //     });
    // });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = { app };