const expect = require('expect');
const request = require('supertest');
var {ObjectID} = require('mongodb');
const _ = require('lodash');

const {app} = require('./../server/server');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {todosDummy, populateTodos, usersDummy, populateUsers} = require('./seed/seed');
var todosDummyDoc;
var usersDummyDoc;

beforeEach(done => {
    populateUsers(done).then(docs => {
        usersDummyDoc = docs;
        done();
    });
});
beforeEach(done => {
    populateTodos(done).then(docs => {
        todosDummyDoc = docs;
        done();
    });
});

describe('POST /users', () => {
    it('should create a user with x-auth valid signature header', done => {
        var validUser = {
            email: 'brandNew@email.com',
            password: 'newValidPassword'
        };
        request(app)
            .post('/users')
            .send(validUser)
            .expect(200)
            .expect(res => {
                expect(res.header['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(validUser.email);
            })
            .end(done);
    });
    it('should complain about an already registered email', done => {
        var validUser = _.pick(usersDummy[0], ['email', 'password']);
        request(app)
            .post('/users')
            .send(validUser)
            .expect(400)
            .end(done);
    });
    it('should complain about invalid email', done => {
        var invalidUser = {
            email: 'invalidemail.com',
            password: 'newValidPassword'
        };
        request(app)
            .post('/users')
            .send(invalidUser)
            .expect(400)
            .end(done);
    });
    it('should complain about empty password', done => {
        var invalidUser = {
            email: 'valid@email.com',
            password: ''
        };
        request(app)
            .post('/users')
            .send(invalidUser)
            .expect(400)
            .end(done);
    });
    it('should complain about abd password', done => {
        var invalidUser = {
            email: 'valid@email.com',
            password: '12345' // at least 6
        };
        request(app)
            .post('/users')
            .send(invalidUser)
            .expect(400)
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', done => {
        request(app)
            .get('/users/me')
            .set('x-auth', usersDummy[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._id).toBe(usersDummy[0]._id.toHexString());
                expect(res.body.email).toBe(usersDummy[0].email);
            }).end(done);
    });

    it('should return 401 unauthenticated (invalid x-auth header)', done => {
        request(app)
            .get('/users/me')
            .set('x-auth', 'my invalid x-auth')
            .expect(401)
            .expect(res => {
                expect(res.body).toEqual({});
            }).end(done);
    })

    it('should return 400 bad request (without x-auth header)', done => {
        request(app)
            .get('/users/me')
            .expect(400)
            .expect(res => {
                expect(res.body).toEqual({});
            }).end(done);
    })
});

describe('PATH /todos/:id', () => {
    it('should update text todo', done => {
        var mId = todosDummyDoc[0]._id.toHexString();
        var updatedTodo = {
            text: 'updated text'
        }
        request(app)
            .patch(`/todos/${mId}`)
            .send(updatedTodo)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(todosDummyDoc[0]._id.toHexString());
            })
            .end((err, res) => {
                if(err) return done(err);
                // should not exist in database now
                Todo.findById(mId).then(obj => {
                    expect(obj.text).toBe(updatedTodo.text);
                    expect(obj.completed).toBe(false);
                    expect(obj.completedAt).toBe(null);
                    done();
                }).catch(e => done(e));
            });
    });

    it('should update text and completed to true and the completedAt', done => {
        var mId = todosDummyDoc[0]._id.toHexString();
        var updatedTodo = {
            text: 'updated text and completed',
            completed: true
        }
        request(app)
            .patch(`/todos/${mId}`)
            .send(updatedTodo)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(todosDummyDoc[0]._id.toHexString());
            })
            .end((err, res) => {
                if(err) return done(err);
                // should not exist in database now
                Todo.findById(mId).then(obj => {
                    expect(obj.text).toBe(updatedTodo.text);
                    expect(obj.completed).toBe(true);
                    expect(obj.completedAt).toBeGreaterThan(0);
                    done();
                }).catch(e => done(e));
            });
    });

    it('should update only the completed and completedAt', done => {
        var mId = todosDummyDoc[0]._id.toHexString();
        var updatedTodo = {
            completed: true
        }
        request(app)
            .patch(`/todos/${mId}`)
            .send(updatedTodo)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(todosDummyDoc[0]._id.toHexString());
            })
            .end((err, res) => {
                if(err) return done(err);
                // should not exist in database now
                Todo.findById(mId).then(obj => {
                    expect(obj.text).toBe(todosDummy[0].text);
                    expect(obj.completed).toBe(true);
                    expect(obj.completedAt).toBeGreaterThan(0);
                    done();
                }).catch(e => done(e));
            });
    });

    it('should error on invalid id', done => {
        var invalidId = '123';
        request(app)
        .patch(`/todos/${invalidId}`)
        .expect(400)
        .expect(res => {
            expect(res.body.message).toBe('invalid id');
            expect(res.body.todo).toBe(undefined);
        })
        .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should delete todo', done => {
        var mId = todosDummyDoc[0]._id.toHexString();
        request(app)
            .delete(`/todos/${mId}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(todosDummyDoc[0]._id.toHexString());
            })
            .end((err, res) => {
                if(err) return done(err);
                // should not exist in database now
                Todo.findById(mId).then(obj => {
                    expect(obj).toBe(null);
                    done();
                }).catch(e => done(e));
            });
    });

    it('should be null for non existent todo, but valid id', done => {
        var validButNonUsedId = new ObjectID().toHexString();
        request(app)
        .delete(`/todos/${validButNonUsedId}`)
        .expect(200)
        .expect(res => {
            expect(res.body.todo).toBe(null);
        })
        .end(done);
    });

    it('should error on invalid id', done => {
        var invalidId = '123';
        request(app)
        .delete(`/todos/${invalidId}`)
        .expect(400)
        .expect(res => {
            expect(res.body.message).toBe('invalid id');
            expect(res.body.todo).toBe(undefined);
        })
        .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should find todo', done => {
        request(app)
            .get(`/todos/${todosDummyDoc[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todosDummy[0].text);
            })
            .end(done);
    });

    it('should find any', done => {
        var validButNonUsedId = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${validButNonUsedId}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo).toBeNull();
            })
            .end(done);
    });
    
    it('should error on invalid ObjectId', done => {
        var validButNonUsedId = '5be872d137d4611d56656d4d1';
        request(app)
            .get(`/todos/${validButNonUsedId}`)
            .expect(400)
            .expect(res => {
                expect(res.body.message).toBe('invalid object id');
            })
            .end(done);
    });
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