// Visit http://157.230.185.127:3000/ to use the chat app!

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', (msg, user) => {
        console.log(`message: ${msg}`);
        io.emit('chat message', `${user}: ${msg}`);
    });

    socket.on('typing', (msg) => {
        console.log('a user is typing...');
        socket.broadcast.emit('typing');
    });

    socket.on('stopped typing', (msg) => {
        console.log('a user is typing...');
        socket.broadcast.emit('stopped typing');
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});