var {mongoose} = require( '../db/mongoose.js');
var UserSchema = {
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1
    }
}
var User = mongoose.model('User', UserSchema);
module.exports = {
    User
}