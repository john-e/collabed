var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var allClients = [];

app.use('/static', express.static('public'));

app.get('/', function(req, res){
    res.sendFile( __dirname + '/chat.html');
});

io.on('connection', function(socket){
    var handshakeData = socket.request;

    if(handshakeData._query.user){
        socket['user'] = handshakeData._query.user;

        //console.log('Connected: '+socket.user);
        io.emit('user-connected', socket.user);
        allClients.push(socket);

        socket.on('chat-message', function(message){
            io.emit('chat-message', {user: socket.user, message: message});
        });
        socket.on('disconnect', function() {
            var i = allClients.indexOf(socket);
            //console.log('Disconnected: '+socket.user);
            io.emit('user-disconnected', socket.user);
            allClients.splice(i, 1);
        });
        socket.on('editor', function(patch){
            socket.broadcast.emit('editor', patch);
        });
    } else
        socket.disconnect();
}); 

http.listen(3000, function(){
    console.log('listening on *:3000');
});