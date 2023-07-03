const {Server} = require('socket.io')
const {logRealtime, log, logErr} = require("../../util/consoleUtil");

exports.Realtime = class Realtime {
    constructor(server) {
        // Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
        this.io = new Server(server, {
            cors: {
                origin: ['http://localhost:3000', 'http://localhost:8081'],
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
                    this.roomData.rooms[room].push(socket);
                } else {
                    this.roomData.rooms[room] = [socket];
                }

                this.io.sockets.in(room).emit('welcome', `${userId} has joined the Whiteboard!`);

                socket.on('drawStart', (cursorX, cursorY) => { //todo add room to draw
                    const roomToBroadcast = 1;
                    this.roomData.rooms[roomToBroadcast].forEach(connection => {
                        if(socket.id !== connection.id){
                            connection.emit("drawStartBC", cursorX, cursorY);
                        }
                    })
                })

                socket.on('drawing', (cursorX, cursorY) => {
                    const roomToBroadcast = 1;
                    this.roomData.rooms[roomToBroadcast].forEach(connection => {
                        if(socket.id !== connection.id){
                            connection.emit("drawingBC", cursorX, cursorY);
                        }
                    })
                })

                socket.on('drawEnd', (cursorX, cursorY) => {
                    const roomToBroadcast = 1;
                    this.roomData.rooms[roomToBroadcast].forEach(connection => {
                        if(socket.id !== connection.id){
                            connection.emit("drawEndBC", cursorX, cursorY);
                        }
                    })
                })

            } else {
                throw new Error("Missing user ID and whiteboard ID in the connection query")
            }

            // Listen for when the client disconnects
            socket.on('disconnect', () => {
                logRealtime(socket.id + " has disconnected");
                socket.removeAllListeners();
                this.roomData.rooms[1] = this.roomData.rooms[1].filter(connection => connection.id !== socket.id);
                //todo implementare l'aggiornamento di roomData
            });

        });
    }

}