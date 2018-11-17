var socket = io();
var $messages = $('#messages');
function scrollToBottom() {
    //var messagesSel = '#messages';
    var newMessage = $messages.children('li:last-child');

    var clientHeight = $messages.prop('clientHeight');
    var scrollTop = $messages.prop('scrollTop');
    var scrollHeight = $messages.prop('scrollHeight');
    var newMessageHeight = $messages.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() | 0;

    //console.log(clientHeight, scrollTop, newMessageHeight, lastMessageHeight, scrollHeight);
    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        $messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function() {
    console.log('connected to the server');

    // socket.emit('createMessage',{
    //     from: 'Tenorio',
    //     text: 'my message'
    // }, function (data) {
    //     console.log('got it', data);
    // });
});

socket.on('newLocation', function(location){
    var template = $('#message-template').html();
    var formattedTime = moment(location.createdAt).format('h:mm a');
    var html = Mustache.render(template, {
        text: 'New User location: ',
        from: location.from,
        createdAt: formattedTime,
        link: true,
        url: `https://google.com/maps?q=${location.text.latitude},${location.text.longitude}`,
        linkText: 'Maps'
    });
    $messages.append(html);
    scrollToBottom();
});

socket.on('disconnect', function() {
    console.log('disconnected from the server');
});

socket.on('newMessage', function(data){
    var template = $('#message-template').html();
    var formattedTime = moment(data.createdAt).format('h:mm a');
    var html = Mustache.render(template, {
        text: data.text,
        from: data.from,
        createdAt: formattedTime
    });
    $messages.append(html);
    scrollToBottom();
    // var formattedTime = moment(data.createdAt).format('h:mm a');
    // var li = $('<li></li>'); 
    // li.html(formattedTime+' '+data.from+': '+data.text);
    // $('#messages').append(li);
});

 $(document).ready(function(){
     var $locationButton = $('#send-location');
     $locationButton.on('click', function(e) {
        if(!navigator.geolocation) {
            return alert('Geolocation not supported');
        }

        $locationButton.attr('disabled', 'disabled').text('Sending location...');

        navigator.geolocation.getCurrentPosition(function(position) {
            $locationButton.removeAttr('disabled').text('Send Location');
            console.log(position);
            var lat= position.coords.latitude;
            var lng = position.coords.longitude;
            socket.emit('createLocationMessage', {
                latitude: lat,
                longitude: lng
            });
        }, function () {
            alert('Unable to fetch location');
            $locationButton.removeAttr('disabled').text('Send Location');
        })
     });


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
