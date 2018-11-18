// ES6 class
class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }
}

var mUsers = new Users();
mUsers.addUser(1, 'Fellipe', 'test');

module.exports = {Users};