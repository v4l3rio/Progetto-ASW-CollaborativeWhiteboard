const {Server} = require('socket.io')
const {logRealtime, log, logErr} = require("../../util/consoleUtil");

exports.Realtime = class Realtime {
    constructor(server, controller) {
        // Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
        this.io = new Server(server, {
            cors: {
                origin: ['http://localhost:3000', "http://localhost:8080"],
                methods: ['GET', 'POST'],
            },
        });
        this.controller = controller;
        this.roomData = {users: {}, connections: {}, rooms: {}};
    }

    listen() {

        // Listen for when the client connects via socket.io-client
        this.io.on('connection', (socket) => {

            if (socket.handshake.query.accessToken && socket.handshake.query.whiteBoardId) {
                const room = socket.handshake.query.whiteBoardId;
                // get the user ID from the connection query and assign that user to the correct room (whiteboard)
                // the room is also get from the connection query

                this.controller.joinWhiteboard(socket.handshake.query.accessToken, socket.handshake.query.whiteBoardId,
                    (err, username) => {
                    if (err) {
                        // todo manage unauthorized access
                        logRealtime("Error connecting: " + err)
                        socket.disconnect();
                    } else if (username) {

                        logRealtime(`${username} has connected`);

                        socket.join(room);
                        logRealtime(`${socket.id} has joined the room: ${room}`)

                        this.roomData.users[username] = room;
                        this.roomData.connections[username] = socket.id;

                        // create a list of all the connections' IDs related to this room
                        if (this.roomData.rooms[room]) {
                            this.roomData.rooms[room].push(socket);
                        } else {
                            this.roomData.rooms[room] = [socket];
                        }


                        switch (socket.handshake.query.type) {
                            case 'notification': {
                                this.roomData.rooms[room].forEach(connection => {
                                    if(socket.id !== connection.id){
                                        connection.emit("notify-my-connection", username);
                                    }
                                })
                                break;
                            }
                            case 'whiteboard': {

                                socket.on('drawStart', (line, accessToken, callback) => {
                                    this.controller.lineStarted(line, accessToken, room, (err, newId) => {
                                        if (err) {
                                            // todo handle unauthorized line
                                        } else {
                                            callback({newId: newId}); // to propagate back to the client the fresh new line id
                                            //console.log(line);
                                            //console.log(newId);
                                            this.roomData.rooms[room].forEach(connection => {
                                                if(socket.id !== connection.id){
                                                    connection.emit("drawStartBC", line, newId);
                                                }
                                            })
                                        }
                                    })
                                })

                                socket.on('drawing', (line, lineId, accessToken) => {
                                    this.controller.lineMove(line, lineId, room, (err) => {
                                        if (!err) {
                                            this.roomData.rooms[room].forEach(connection => {
                                                if(socket.id !== connection.id){
                                                    connection.emit("drawingBC", line, lineId);
                                                }
                                            })
                                        } else {
                                            // todo handle error
                                        }
                                    })

                                })

                                socket.on('drawEnd', (line, lineId, accessToken) => {
                                    this.controller.lineEnd(line, accessToken, lineId, room, (err) => {
                                        if (err) {
                                            // todo handle unauthorized line
                                        } else {
                                            this.roomData.rooms[room].forEach(connection => {
                                                if(socket.id !== connection.id){
                                                    connection.emit("drawEndBC", line, lineId);
                                                }
                                            })
                                        }
                                    })

                                })

                                break;
                            }
                        }



                        // Listen for when the client disconnects
                        socket.on('disconnect', () => {
                            logRealtime(socket.id + " has disconnected");
                            socket.removeAllListeners();
                            this.roomData.rooms[room] = this.roomData.rooms[room].filter(connection => connection.id !== socket.id);
                            //todo implementare l'aggiornamento di roomData
                        });
                    } else {
                        // todo manage internal server error
                        logErr("Internal server error")
                    }
                })



            } else {
                logErr("Missing user ID and whiteboard ID in the connection query");
            }
        });
    }

}