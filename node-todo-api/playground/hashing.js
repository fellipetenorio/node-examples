const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 10
};

var token = jwt.sign(data, '123abc')
console.log(token);

var decoded = jwt.verify(token+'s', '123abc')
    .then(decoded => console.log(decoded))
    .catch(err => console.log('laksdjfasdlkfjadslkfj', err));
//console.log(decoded);