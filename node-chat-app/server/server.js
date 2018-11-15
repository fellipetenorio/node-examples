const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '..', 'public');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
const port = process.env.PORT || 3000;

app.use(express.static(publicPath));

io.on('connection', socket => {
    console.log('new user connected');

    // Welcome connected user
    socket.emit('newMessage', generateMessage('Admin', 'Welcome!'));
    // notify everybody else about this connection
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    socket.on('createMessage', (message, callback) => {
        console.log(message);
        // emit for all live connections
        io.emit('newMessage', generateMessage(message.from, message.text));
        // acknowledgement about the message (callback to run in client)
        // console.log(callback);
        callback(true);
    });

    socket.on('createLocationMessage', location => {
        console.log('createLocationMessage', location);
        io.emit('newLocation', generateMessage('Admin', location));
    });

    socket.on('disconnect', () => {
        console.log('client disconnect');
    });
});

server.listen(port, () => {
    console.log(`Started on port ${port}`);
});