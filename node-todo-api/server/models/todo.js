var {mongoose} = require( '../db/mongoose');
var TodoSchema = {
    text: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    // no need because the _id possess the timestamp
    completedAt: {
        type: Number,
        default: null
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
};
var Todo = mongoose.model('Todo', TodoSchema);
module.exports = {
    Todo
};