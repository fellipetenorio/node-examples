console.log('Starting app.');

const fs = require('fs');
const os = require('os');
const _ = require('lodash');
const notes = require('./notes.js');

var filterArray = _.uniq(['A', 1, 'A', 1,2,3,4,5]);
console.log(filterArray);

// console.log(_.isString(true));
// console.log(_.isString('asdf')); 

// var user = os.userInfo();
// var res = notes.addNote();
// console.log(res);
//console.log(os.userInfo())
// fs.appendFile('greetings.txt', `Hello ${user.username}! You are ${notes.age}\n`, function(err) {
//     if(!err) return;
//     console.log('Unable to write to file');
// });
// fs.appendFileSync('greeting.txt', `Hello ${user.username}!\n`);
