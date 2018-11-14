var socket = io();
socket.on('connect', function() {
    console.log('connected to the server');

    socket.emit('createMessage',{
        from: 'Tenorio',
        message: 'my message'
    }, function (data) {
        console.log('got it', data);
    });
});

socket.on('disconnect', function() {
    console.log('disconnected from the server');
});

socket.on('newMessage', function(data){
    console.log('New Message', data);
});

socket.emit('createMessage', {
    from: 'Mary',
    text: 'Message to test the confirmation'
}, function (data) {
    console.log('got it', data);
});