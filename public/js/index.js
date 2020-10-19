const socket = io();

//catch message sent from server
socket.on('message', message => {
    console.log(message);
});