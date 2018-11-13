const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {Todo} = require('./../../server/models/todo');
const {User} = require('./../../server/models/user');

const todosDummy = [
    {text: 'First test todo'},
    {text: 'Second test todo'},
];

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const usersDummy = [
    {
        _id: userOneId,
        email: 'user1@email.com',
        password: 'userOnePassword',
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id:userOneId, access: 'auth'}, 'abc123').toString()
        }]
    },
    {
        _id: userTwoId,
        email: 'user2@email.com',
        password: 'userTwoPassword',
        // tokens: [{
        //     access: 'auth',
        //     token: jwt.sign({_id:userTwoId, access: 'auth'}, 'abc123').toString()
        // }]
    }
];

const populateTodos = done => {
    return Todo.deleteMany({})
    .then(() => {
        return Todo.insertMany(todosDummy).then(docs => docs);
    });
};

const populateUsers = done => {
    return User.deleteMany({}).then(() => {
        var userOne = new User(usersDummy[0]).save();
        var userTwo = new User(usersDummy[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => User.find({}));
}

module.exports = {todosDummy, populateTodos, usersDummy, populateUsers};