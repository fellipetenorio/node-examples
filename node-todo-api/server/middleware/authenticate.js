var { User } = require('./../models/user');
// middleware to require the user for private routes
var authenticate = (req, res, next) => {
    var token = req.header('x-auth');
    if(!token)
        return res.status(400).send();
    User.findByToken(token).then(user => {
        if (!user)
            return Promise.reject();

        req.user = user;
        req.token = token;
        next();
    }).catch(err => res.status(401).send());
};

module.exports = {authenticate};