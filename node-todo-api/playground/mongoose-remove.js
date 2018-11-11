const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '5be872d137d4611d56656d4d';
var invalidId = '6be872d137d4611d56656d4d1';

// many files todo.remove({})
//Todo.deleteMany({}).then(res => console.log('removed all docs', res));

// Remove one
Todo.deleteOne({
    _id: new ObjectID('5be88509fc8226233d0d61e6')
}).then(res => console.log('deleteOne', res));

// Remove by id
Todo.findByIdAndRemove('5be88510fc8226233d0d61e9').then(res => console.log('findByIdAndRemove', res));