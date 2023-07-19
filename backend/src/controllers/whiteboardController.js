const {Authorizer} = require("../auth/Authorizer");
const {Model} = require("../models/model");
const {logErr} = require("../util/consoleUtil");

const authZ = new Authorizer(Model);
exports.authZ = authZ;

/*
    ----------------------------------------------------------------------------------------------------------------
    EXPRESS ROUTES
    ----------------------------------------------------------------------------------------------------------------
*/

exports.getWhiteboardData = async (req, res) => {
    if (req.params?.id && req.query.accessToken) {
        authZ.normalUserToWhiteboard(req.query.accessToken, req.params.id).then(result => {
            const {err} = result;
            if (err) {
                res.status(401).json({message: err})
            } else {
                Model.findOneWhiteboard(req.params.id).then(whiteboardData => {
                    if (whiteboardData) {
                        res.status(200).json({whiteboardData: whiteboardData});
                    } else {
                        res.status(404).json({message: "Not found"})
                    }
                });
            }
        })
    } else {
        res.status(400).json({message: "Missing access token or whiteboard ID in the request"})
    }
}

exports.inviteToWhiteboard = (req, res) => {
    console.log(req.body.accessToken + req.body.username + req.body.whiteboardId);
    if (req.body.accessToken && req.body.username && (req.body.whiteboardId !== undefined)) {
        authZ.ownerToWhiteboard(req.body.accessToken, req.body.whiteboardId).then(result => {
            const {err} = result;
            if (err) {
                logErr(err)
                res.status(401).json({message: err});
            } else {
                Model.inviteUserToWhiteboard(req.body.username, req.body.whiteboardId).then(() => {
                    res.status(200).json({message: "User invited successfully"});
                })
            }
        });
    } else {
        res.status(400).json({message: "Missing access token, username or whiteboard ID in the request"})
    }
}


/*
    ----------------------------------------------------------------------------------------------------------------
    THESE ARE THE ONES FOR SOCKET IO
    ----------------------------------------------------------------------------------------------------------------
*/
exports.joinWhiteboard = (accessToken, whiteboardId, callback) => {
    authZ.normalUserToWhiteboard(accessToken, whiteboardId).then(result => {
        const {err, username} = result;
        if (err) {
            callback(err, undefined);
        } else {
            callback(undefined, username);
        }
    })
}

exports.lineStarted = (line, accessToken, whiteboardId, callback) => {
    authZ.authorizeNewLine(accessToken, whiteboardId).then(result => {
        const {err} = result;   // the authorizer generates fresh new line id
        if (err) {
            callback(err, undefined);
        } else {
            Model.generateFreshLineId(whiteboardId).then(id => {
                callback(undefined, id);
            })
        }
    })
}

// maybe unnecessary
exports.lineMove = (line, lineId, whiteboardId, callback) => {
    const {point, color} = line;
    callback();
}

exports.lineEnd = (line, accessToken, lineId, whiteboardId, callback) => {
    authZ.authorizeLineEnd(accessToken, lineId, whiteboardId).then(result => {
        if (result.err) {
            callback(result.err)
        } else {
            //console.log(line);
            Model.insertLine(whiteboardId, lineId, line).then((result) => {
                if (result?.err) {
                    callback(result.err)
                } else {
                    callback();
                }
            })
        }
    });
}

exports.lineDelete = (lineId, accessToken, whiteboardId, callback) => {
    authZ.authorizeLineDelete(accessToken, lineId, whiteboardId).then(result => {
        if (result.err) {
            callback(result.err);
        } else {
            Model.deleteLine(whiteboardId, lineId).then(result => {
                if (result) {
                    callback(result.err)
                } else {
                    callback();
                }
            })
        }
    });
}