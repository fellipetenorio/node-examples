const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID(); // create a new id like mongo
// console.log(obj);

// var user = {name: 'Fellipe'};
// var {name} = user; //destruction
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err) {
        return console.log('Problem to connect to mongo', err);
    }
    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');
    
    // findOneAnUpdate
    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID("5be399822b73e5064b8abe34")
    }, {
        $set: {
            completed: true
        }
    }, {
        returnOriginal: false
    }).then(res => {
        console.log(res);
    });

    // client.close();
});