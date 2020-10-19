const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

//catch any message sent from server
socket.on('message', message => {
    //console.log(message);

    outputMessage(message);

    //Always scroll down to new message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //e.target targets the current element
    //elements.msg gets the input field with id = msg
    
    //Get input value
    const msg = e.target.elements.msg.value;

    //console.log(msg);

    //emit msg to server
    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});

//output message to dom as chat thread cards
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class="meta"> Mary <span>6:49pm</span></p>
        <p class="text">${message}</p>
    `;

    chatMessages.appendChild(div);
}