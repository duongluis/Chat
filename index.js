const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
// const io = require('socket.io')(http);
// const port = process.env.port || 80;
// var socket = require(socket)
const Redis = require('redis');
const client = Redis.createClient({legacyMode: true});

const io = new Server(server);

var data=' ';

// app.get('/', (req, res) =>{
//     // res.send('<h1>Hello World!</h1>');
//     res.sendFile(__dirname + '/index.html');
// });

(async () => {
    await client.connect();
})();

client.on('connect', () => console.log('Redis Client Connected'));
client.on('error', (err) => console.log('Redis Client Connection Error', err));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
    // client.setEx('user',JSON.stringify());
});

io.on('connection', (socket) => {
    //them id vua ket noi vao redis
    client.set(socket.id,'');
    console.log(socket.id + ' connected');
    
    socket.on('disconnect',() => {
        //xoa id ngat ket noi ra khoi redis
        client.del(socket.id);
        console.log(socket.id + " disconnected ");
    });
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) =>  {
        // console.log(socket.id + " : " + msg);
        data += msg + " || " ;
        client.set('message', JSON.stringify(data));
       io.emit('chat message', msg);

       client.get('message', (err, data) => {
        if (err) throw err;
        console.log(data);
    });

    });
});

// io.on('connection', (socket) => {
//     socket.broadcast.emit('hi');
// });

server.listen(5000, () => {
    console.log('listening on *:5000');
});