var socket = io();
socket.on('connect', function() {
    console.log('connected to the server');

    // socket.emit('createMessage',{
    //     from: 'Tenorio',
    //     text: 'my message'
    // }, function (data) {
    //     console.log('got it', data);
    // });
});

socket.on('disconnect', function() {
    console.log('disconnected from the server');
});

socket.on('newMessage', function(data){
    console.log('New Message', data);
    var li = $('<li></li>');
    li.html(data.from+': '+data.text);
    $('#messages').append(li);
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
