const db = require('./db.js');
module.exports.handleSignup = (email, password) => {
    // check if email already exists
    // save the user in db
    db.saveUser({email, password});
    // send welcome email
}