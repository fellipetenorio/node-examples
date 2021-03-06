const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message');
const validation = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '..', 'public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on('connection', socket => {
    console.log('new user connected');

    socket.on('join', (message, callback) => {
        console.log('new attemp to join', message);
        if(!validation.isRealString(message.name) || !validation.isRealString(message.room))
            return callback('invalid name or room');
        socket.join(message.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, message.name, message.room);

        io.to(message.room).emit('updateUserList', users.getUserList(message.room));

        // socket.leave to leave the room
        // io.emit => to all connected client
        // socker.broadcast.emit to all clients then this
        // io.to(message.room).emit => emit event to specific room
        // socket.broadcast.to(message.room).emit => to all clients whitin the room except the current user

        // // Welcome connected user
        socket.emit('newMessage', generateMessage('Admin', 'Welcome!'));
        // // notify everybody else about this connection
        // socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));
        // notify only the room
        socket.broadcast.to(message.room).emit('newMessage', generateMessage('Admin', `${message.name} joined the rrom!`));
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        console.log(message);
        var user = users.getUser(socket.id);
        // emit for all live connections
        io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        // acknowledgement about the message (callback to run in client)
        // console.log(callback);
        callback(true);
    });

    socket.on('createLocationMessage', location => {
        console.log('createLocationMessage', location);
        var user = users.getUser(socket.id);
        if(user)
            io.to(user.room).emit('newLocation', generateMessage(user.name, location));
    });

    socket.on('disconnect', () => {
        console.log('client disconnect', socket.id);
        var user = users.removeUser(socket.id);
        io.to(user.room).emit('updateUserList', users.getUserList(user.room));
        io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    });
});

app.get('/message', (req, res) => {
    io.emit('newMessage', generateMessage('site', 'Hello!'));
    res.send('asdf');
})

server.listen(port, () => {
    console.log(`Started on port ${port}`);
});