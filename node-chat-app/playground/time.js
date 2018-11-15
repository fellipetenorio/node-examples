// January 1st 1970 00:00:00 am
const moment = require('moment');
// var date = new Date();
// var months = ['Jan', 'Feb'];
// console.log(date);

var someTimestamp = moment().valueOf();
var createdAt = 1234;
var date = moment(createdAt);
//date.add(1, 'year').subtract(9, 'month');
console.log(date.format('D/M/Y H:m:s'));