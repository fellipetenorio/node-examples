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
 $(document).ready(function(){
     $('#message-form').submit(function (){
        var $textInp = $('input#message'); 
        var text = $textInp.val();

        socket.emit('createMessage', {
            from: 'Mary',
            text: text
        }, function (data) {
            if(data === true)
                $textInp.val('');
        });
        return false;
     });
 });
