var socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.querySelector('input');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', function (msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.removeChild(messages.lastChild);
    messages.appendChild(msg);
    window.scrollTo(0, document.body.scrollHeight);
});


input.addEventListener('input', function (e) {
    console.log("typing")
    e.preventDefault();
    socket.emit('typing', input.value);
});

socket.on('typing', function () {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild("another user is typing...");
    window.scrollTo(0, document.body.scrollHeight);
});