var expect = require('expect');
var {Users} = require('./users');
var mUsers;
beforeEach(() => {
    mUsers = new Users();
});

describe('Create user', () => {
    it('should create a user', done => {
        var user = {
            id: 1,
            name: 'tenorio',
            room: 'test'
        };

        mUsers.addUser(user.id, user.name, user.room);
        expect(mUsers.users.length).toBe(1);
        expect(mUsers.users[0]).toEqual(user);
        
        done();
    });
});