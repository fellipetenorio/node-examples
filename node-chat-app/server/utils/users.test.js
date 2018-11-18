var expect = require('expect');
var {Users} = require('./users');
var users;
beforeEach(() => {
    users = new Users();
    users.users = [
    {
        id: '1',
        name: 'Tenorio',
        room: 'developers'
    },
    {
        id: '2',
        name: 'Felipe',
        room: 'Test'
    },
    {
        id: '3',
        name: 'Joao',
        room: 'QA'
    },
    {
        id: '4',
        name: 'Mario',
        room: 'developers'
    },
    ];
});

describe('Create user', () => {
    
    it('should remove user with id 1', done => {
        var lengthBefore = users.users.length;
        var deletedUser = users.removeUser('1');
        expect(deletedUser).toBeTruthy();
        expect(users.users.length).toBe(lengthBefore-1);
        expect(deletedUser.id).toBe('1');
        expect(users.getUser('1')).toBe(undefined);
        done();
    });

    it('should return user id 3', done => {
        var user = users.getUser('3');
        expect(user).toBeTruthy();
        expect(user.id).toEqual('3');
        expect(user.name).toBe('Joao');
        expect(user.room).toBe('QA');
        done();
    });

    it('should return users name for room developers', done => {
        var namesArr = ['Mario', 'Tenorio'];
        var names = users.getUserList('developers');
        expect(names.length).toBe(2);
        expect(names).toEqual(
            expect.arrayContaining(namesArr)
        );
        expect()
        done();
    });

    it('should create a user', done => {
        var user = {
            id: 1,
            name: 'tenorio',
            room: 'test'
        };
        const lengthBefore = users.users.length;
        users.addUser(user.id, user.name, user.room);
        expect(users.users.length).toBe(lengthBefore+1);
        expect(users.users[lengthBefore]).toEqual(user);
        
        done();
    });
});