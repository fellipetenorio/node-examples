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
    
    // deleteMany. delete all "Something to do"
    // db.collection('Todos').deleteMany({
    //     text: 'Something to do'
    // }).then(result => {
    //     console.log(result);
    // });
    
    // deleteOne
    // db.collection('Todos').deleteOne({
    //     text: 'Something to do'
    // }).then(result => {
    //     console.log(result);
    // });

    // findOneAndDelete
    db.collection('Todos').findOneAndDelete({
        text: 'Something to do'
    }).then(result => {
        console.log(result);
        // return the deleted object
        // { lastErrorObject: { n: 1 },
        // value:
        // { _id: 5be39981fd2903064a7a9f97,
        //     text: 'Something to do',
        //     completed: false },
        // ok: 1 }
    });

    db.collection('Todos')

    // client.close();
});