var {mongoose} = require( '../db/mongoose');

var TodoSchema = new mongoose.Schema({
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
});

TodoSchema.statics.findByIdAndCreatorAndDelete = function(_id, _creator) {
    var Todo = this;
    return Todo.findOne({_id, _creator}).then(todo => {
        if(!todo)
            return Promise.reject('Todo not found (or from other user)');
        return Todo.findByIdAndRemove(_id);
    });
}

var Todo = mongoose.model('Todo', TodoSchema);
module.exports = {
    Todo
};