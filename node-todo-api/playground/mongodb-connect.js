// npm install mongodb --save
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
    db.collection('Todos').insertOne({
        text: 'Something to do',
        completed: false
    }, (err, result) => {
        if(err)
            return console.log('Unable to insert todo', err);
        console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    });

    client.close();
});