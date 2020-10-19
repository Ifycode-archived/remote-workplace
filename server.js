const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const messageFormat = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//Setting folder containing static files
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Chat Bot';

io.on('connection', socket => {

    //Add welcome and broadcast inside the joinChatRoom since we're now dealing with rooms
    socket.on('joinChatRoom', ({username, room}) => {
    
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        //For emit to the single user that is connecting
        socket.emit('message', messageFormat(botName, 'Welcome to Remote Workplace chat'));

        //Broadcast to room when user joins chat
        socket.broadcast.to(user.room).emit('message', messageFormat(botName, `<b>${user.username}</b> joined chat`));
    
    });

    //Listen for chatMessage from client
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        
        //emit back to client (all users)
        io.to(user.room).emit('message', messageFormat(`<b>${user.username}</b>`, msg));

    });

    //Runs when user disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message', messageFormat(botName, `<b>${user.username}</b> has left the chat`));
        }
    });

});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
