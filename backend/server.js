const express = require('express');
const app = express();
http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors()); // Add cors middleware

const server = http.createServer(app);

// Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

let connections = [];

// Listen for when the client connects via socket.io-client
io.on('connection', (socket) => {
    connections.push(socket);
    console.log(socket.id + " has connected");

    socket.emit('message', 'Hello from the server');

    // Listen for when the client disconnects
    socket.on('disconnect', () => {
        console.log(socket.id + " has disconnected");
        connections = connections.filter(connection => connection.id !== socket.id);
    });

});

server.listen(4000, () => 'Server is running on port 4000');