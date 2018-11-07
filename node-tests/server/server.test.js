const request = require('supertest');
const  expect = require('expect');

var app = require('./server.js').app;

describe('Server', () => {
    describe('GET /', () => {
        it('should return hello world', (done) => {
            request(app)
                .get('/')
                .expect(404)
                .expect((res) => {
                    expect(res.body).toInclude({
                        error: 'Page not found'
                    });
                })
                .end(done);
        });
    });

    describe('GET /users', () => {
        it('should two users', (done) => {
            request(app)
                .get('/users')
                .expect(200)
                .expect((res) => {
                    expect(res.body.length).toBe(2);
                })
                .end(done);
        });
    });
});