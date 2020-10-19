const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

//catch any message sent from server
socket.on('message', message => {
    console.log(message);

    outputMessage(message);

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

//output message to dom as chat thread cards
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class="meta"> ${message.username} <span>${message.time}</span></p>
        <p class="text">${message.text}</p>
    `;

    chatMessages.appendChild(div);
}