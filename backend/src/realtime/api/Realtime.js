const {Server} = require('socket.io')
const {logRealtime, log, logErr} = require("../../util/consoleUtil");

exports.Realtime = class Realtime {
    constructor(server) {
        // Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
        this.io = new Server(server, {
            cors: {
                origin: 'http://localhost:3000',
                methods: ['GET', 'POST'],
            },
        });

        this.roomData = {users: {}, connections: {}, rooms: {}};
    }

    listen() {

        // Listen for when the client connects via socket.io-client
        this.io.on('connection', (socket) => {
            if (socket.handshake.query.userId && socket.handshake.query.whiteBoardId) {

                // get the user ID from the connection query and assign that user to the correct room (whiteboard)
                // the room is also get from the connection query

                const userId = socket.handshake.query.userId;
                logRealtime(`${userId} has connected`);
                const room = socket.handshake.query.whiteBoardId;
                socket.join(room);
                logRealtime(`${socket.id} has joined the room: ${room}`)

                this.roomData.users[userId] = room;
                this.roomData.connections[userId] = socket.id;

                // create a list of all the connections' IDs related to this room
                if (this.roomData.rooms[room]) {
                    this.roomData.rooms[room].push(socket.id);
                } else {
                    this.roomData.rooms[room] = [socket.id];
                }

                this.io.sockets.in(room).emit('welcome', `${userId} has joined the Whiteboard!`);

            } else {
                throw new Error("Missing user ID and whiteboard ID in the connection query")
            }

            // Listen for when the client disconnects
            socket.on('disconnect', () => {
                logRealtime(socket.id + " has disconnected");
                socket.removeAllListeners();
            });

        });
    }

}