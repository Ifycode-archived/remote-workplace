const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Setting folder containing static files
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {

    /*==================================
    Setting up connection from server to client side
    ====================================*/

    //1. For emit to the single user that is connecting
    //e.g. Welcoming current user to the platform
    socket.emit('message', 'Welcome to Remote Workplace chat');

    //2. For all users except for the one that is connecting
    socket.broadcast.emit('message', 'A user has joined the chat');

    /*3. For broadcast to all users
        
        io.emit();

    */

    //Runs when user disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat');
    });

    //Listen for chatMessage from client
    socket.on('chatMessage', msg => {
        //console.log(msg);

        //emit back to client (all users)
        io.emit('message', msg);

    });

});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
