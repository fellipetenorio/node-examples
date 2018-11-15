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

socket.on('newLocation', function(location){
    var a = $('<a></a>')
            .attr('target', '_blank')
            .attr('href', `https://google.com/maps?q=${location.text.latitude},${location.text.longitude}`)
            .html(`${location.text.latitude},${location.text.longitude}`);
    
    var li = $('<li></li>');
    li.html(location.from+': ').append(a);
    $('#messages').append(li);
});

socket.on('disconnect', function() {
    console.log('disconnected from the server');
});

socket.on('newMessage', function(data){
    var formattedTime = moment(data.createdAt).format('h:mm a');
    var li = $('<li></li>'); 
    li.html(formattedTime+' '+data.from+': '+data.text);
    $('#messages').append(li);
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
