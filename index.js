const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
// const io = require('socket.io')(http);
// const port = process.env.port || 80;
// var socket = require(socket)

const io = new Server(server);

app.get('/', (req, res) =>{
    // res.send('<h1>Hello World!</h1>');
    res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket) => {
    console.log(socket.id + ' connected');
    socket.on('disconnect',() => {
        console.log(socket.id + " disconnected ");
    });
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) =>  {
        // console.log(socket.id + " : " + msg);
       io.emit('chat message', msg);
    });
});

// io.on('connection', (socket) => {
//     socket.broadcast.emit('hi');
// });

server.listen(5000, () => {
    console.log('listening on *:5000');
});