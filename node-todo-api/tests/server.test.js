const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server/server');
const {Todo} = require('./../server/models/todo');

const todosDummy = [
    {text: 'First test todo'},
    {text: 'Second test todo'},
];

beforeEach(done => {
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(todosDummy);
        }).then(() => done());
});

describe('GET /todos', () => {
    it('should list two todos', done => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect(res => {
                expect(res.body.todos.length).toBe(todosDummy.length);
                expect(res.body.todos[0].text).toBe(todosDummy[0].text);
            })
            .end(done);
    });
});

describe('POST /todos', () => {
    it('should create a new todo', done => {
        var text = 'Test todo text';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if(err)
                    return done(err);
                Todo.find().then(todos => {
                    expect(todos.length).toBe(todosDummy.length+1);
                    expect(todos[todosDummy.length].text).toBe(text);
                    done();
                }).catch(e => done(e));

            });
    });

    it('should not create todo with invalid body data', done => {
        var invalidTodo = {text:''};
        request(app)
            .post('/todos', )
            .send(invalidTodo)
            .expect(400)
            .end((err, res) => {
                if(err)
                    return done(err);
                Todo.find().then(todos => {
                    expect(todos.length).toBe(todosDummy.length);
                    done();
                }).catch(e => done(e));
            });
    });
});