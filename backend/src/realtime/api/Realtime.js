const {Server} = require('socket.io')

exports.Realtime = class Realtime {
    constructor(server) {
        // Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
        this.io = new Server(server, {
            cors: {
                origin: 'http://localhost:3000',
                methods: ['GET', 'POST'],
            },
        });

        this.connections = [];

        // Listen for when the client connects via socket.io-client
        this.io.on('connection', (socket) => {
            this.connections.push(socket);
            console.log(socket.id + " has connected");

            socket.emit('message', 'Hello from the server');

            // Listen for when the client disconnects
            socket.on('disconnect', () => {
                console.log(socket.id + " has disconnected");
                this.connections = this.connections.filter(connection => connection.id !== socket.id);
            });

        });
    }
}