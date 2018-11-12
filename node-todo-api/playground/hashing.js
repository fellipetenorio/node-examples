const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';
var p = '123';
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    })
});

// var hashedPassword = '$2a$10$qGuoj/8PB2dEEtbHRkMtseElfYgAmoFsMzmYDU3hEJjCj4ZaNqjWC';
// bcrypt.compare(password, hashedPassword, (err, res) => {
//     console.log(res);
// })

// bcrypt.compare(p, hashedPassword, (err, res) => {
//     console.log(res);
// })

// var data = {
//     id: 10
// };

// var token = jwt.sign(data, '123abc')
// console.log(token);

// var decoded = jwt.verify(token+'s', '123abc')
//     .then(decoded => console.log(decoded))
//     .catch(err => console.log('laksdjfasdlkfjadslkfj', err));
// //console.log(decoded);