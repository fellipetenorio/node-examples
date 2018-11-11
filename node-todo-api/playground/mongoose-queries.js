const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5be872d137d4611d56656d4d';
var invalidId = '6be872d137d4611d56656d4d1';

// Todo.find({
//     _id: id
// }).then(todos => console.log('Find', todos));

// Todo.findOne({
//     _id: id
// })
// .then(todo => console.log('FindOne', todo))
// .catch(err => console.log(err));

// Todo.findById(id)
// .then(todo => console.log('FindById', todo))
// .catch(err => console.log(err));

// if(!ObjectID.isValid(invalidId)) {
//     return console.log('ID no valid');
// }

// Todo.find({
//     _id: invalidId
// }).then(todos => console.log('Find invalidId', todos))
// .catch(err => console.log(err));

// Todo.findOne({
//     _id: invalidId
// })
// .then(todo => console.log('FindOne invalidId', todo))
// .catch(err => console.log(err));

// Todo.findById(invalidId)
// .then(todo => {
//     if(!todo)
//         return console.log('Id not found');
//     console.log('FindById invalidId', todo);
// })
// .catch(err => console.log(err));

var userId = '5be61fb62c131a10e7716475';
if(!ObjectID.isValid(userId))
    return console.log('invalid user id');
User.findById(userId).then(user => {
    if(!user)
        return console.log('Unable to find user');
    console.log(JSON.stringify(user, undefined, 2));
}, e => console.log(e));