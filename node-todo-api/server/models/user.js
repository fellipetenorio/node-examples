const {mongoose} = require( '../db/mongoose.js');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    tokens: [{
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// overrides toJSON to void data to go back to user
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
};

// create new instance method to create token to the user
UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
    user.tokens.push({access, token});
    return user.save().then(res => token);
}

UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;
    return User.findOne({email}).then(user => {
        if(!user) return Promise.reject('user not found');

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(err) return reject(err);
                if(!res) return reject('invalid user or password');
                // generate token
                resolve(user);
            })
        });
    });
}

// create a static model method to search the user by token
UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;
    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })
}

// use function to have access to 'this'
UserSchema.pre('save', function (next) {
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            if(err)
                return Promise.reject(err);
            bcrypt.hash(user.password, salt, (err, hash) => {
                if(err)
                    return Promise.reject(err);
                    
                user.password = hash;
                next();
            })
        });
    } else {
        next();
    }
})

var User = mongoose.model('User', UserSchema);
module.exports = {
    User
}