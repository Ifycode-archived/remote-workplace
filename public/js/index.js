const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Extract username & room from chat room URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

//console.log(username, room);

const socket = io();

//Join chatroom (Emit extracted username & room to server)
socket.emit('joinChatRoom', {username, room});

//Get room & user from server
socket.on('roomUsers', ({ room, users}) => {
    displayRoomName(room);
    displayUsers(users);
});

//catch any message sent from server
socket.on('message', message => {
    console.log(message);

    displayMessage(message);

    //Always scroll down to new message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    //Get input value
    const msg = e.target.elements.msg.value;

    //emit msg to server
    socket.emit('chatMessage', msg);

    //clear the input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});

//display message to dom as chat thread cards
function displayMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class="meta"> ${message.username} <span>${message.time}</span></p>
        <p class="text">${message.text}</p>
    `;

    chatMessages.appendChild(div);
}

//Add room name to DOM
function displayRoomName(room) {
    roomName.innerHTML = room;
}

//Add users to DOM
function displayUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
