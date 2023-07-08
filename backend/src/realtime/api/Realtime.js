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
        this.roomData = {users: {}, connections: {}, rooms: {}, usersInWhiteboard: {}};
    }

    listen() {

        // Listen for when the client connects via socket.io-client
        this.io.on('connection', (socket) => {
            if (socket.handshake.query.accessToken) {
                socket.on("joinWhiteboard", (accessToken, whiteboardId)=> {
                    const room = whiteboardId;
                    // get the user ID from the connection query and assign that user to the correct room (whiteboard)
                    // the room is also get from the connection query
                    this.controller.joinWhiteboard(accessToken, room,
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
                                    this.roomData.usersInWhiteboard[room].push(username);
                                    this.roomData.rooms[room].push(socket);
                                } else {
                                    this.roomData.usersInWhiteboard[room] = [username];
                                    this.roomData.rooms[room] = [socket];
                                }

                                this.roomData.rooms[room].forEach(connection => {
                                    if(socket.id !== connection.id){
                                        connection.emit("user-connected", username);
                                    }
                                })

                                //this.io.sockets.in(room).emit('welcome', `${username} has joined the Whiteboard!`);

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


                                socket.on('getAllConnectedUsers', ()=>{
                                    socket.emit('allConnectedUsers', this.roomData.usersInWhiteboard[room]);
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

                                // Listen for when the client disconnects
                                socket.on('leftWhiteboard', () => {
                                    logRealtime(username + " has disconnected from the whiteboard");
                                    this.roomData.rooms[room] = this.roomData.rooms[room].filter(connection => connection.id !== socket.id);
                                    this.roomData.usersInWhiteboard[room] = this.roomData.usersInWhiteboard[room].filter(user => user !== username);
                                    socket.removeAllListeners("drawStart");
                                    socket.removeAllListeners("getAllConnectedUsers");
                                    socket.removeAllListeners("drawing");
                                    socket.removeAllListeners("drawEnd");
                                    socket.removeAllListeners("leftWhiteboard");
                                    //todo implementare l'aggiornamento di roomData
                                });
                            } else {
                                // todo manage internal server error
                                logErr("Internal server error")
                            }
                        })



                });
                // Listen for when the client disconnects
                socket.on('disconnect', () => {
                    logRealtime(socket.id + " has disconnected");
                    socket.removeAllListeners();
                });

            } else {
                logErr("Missing access token in the connection query");
            }
        });
    }

}