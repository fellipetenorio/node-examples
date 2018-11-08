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
    // console.log('Connected to MongoDB server');
    // const db = client.db('TodoApp');
    // db.collection('Todos').find({
    //     _id: new ObjectID('5be39508fd132e0551b746c5')
    // }).toArray().then(docs => {
    //     console.log('Todo', docs.length);
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, err => {
    //     console.log('Unable to fetch mongodb', err);
    // });

    console.log('Connected to MongoDB server');
    const db = client.db('TodoApp');
    db.collection('Todos').find({
        // _id: new ObjectID('5be39508fd132e0551b746c5')
    }).count().then(count => {
        console.log(`Todos count: ${count}`);
    }, err => {
        console.log('Unable to fetch mongodb', err);
    });

    // client.close();
});