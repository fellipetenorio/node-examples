const {ObjectID} = require('mongodb');
const {Todo} = require('./../../server/models/todo');
const {User} = require('./../../server/models/user');

const todosDummy = [
    {text: 'First test todo'},
    {text: 'Second test todo'},
];

const populateTodos = done => {
    return Todo.remove({})
    .then(() => {
        return Todo.insertMany(todosDummy).then(docs => docs);
    });
};

module.exports = {todosDummy, populateTodos};