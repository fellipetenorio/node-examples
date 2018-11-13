var socket = io();
socket.on('connect', function() {
    console.log('connected to the server');

    socket.emit('createEmail', {
        to: "me@email",
        opt: true
    })
});

socket.on('disconnect', function() {
    console.log('disconnected from the server');
});

socket.on('newEmail', function(data){
    console.log('New Email', data);
});