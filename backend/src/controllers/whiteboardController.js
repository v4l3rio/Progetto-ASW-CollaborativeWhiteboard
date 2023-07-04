const {Authorizer} = require("../auth/Authorizer");
const {TestModel} = require("../models/testModel");

const authZ = new Authorizer(TestModel);
exports.authZ = authZ;

/*
    ----------------------------------------------------------------------------------------------------------------
    EXPRESS ROUTES
    ----------------------------------------------------------------------------------------------------------------
*/

exports.getWhiteboardData = async (req, res) => {
    if (req.params?.whiteboardId && req.body.accessToken) {
        authZ.authorizeToWhiteboard(req.body.accessToken, req.params.whiteboardId).then(result => {
            const {err} = result;
            if (err) {
                res.status(401).json({message: err})
            } else {
                TestModel.findOneWhiteboard(req.params.whiteboardId).then(whiteboardData => {
                    if (whiteboardData) {
                        res.status(200).json({whiteboardData: whiteboardData});
                    } else {
                        res.status(404).json({message: "Not found"})
                    }
                });
            }
        })
    }
}

exports.inviteToWhiteboard = (req, res) => {
    if (req.body.accessToken && req.body.username && req.body.whiteboardId) {
        authZ.authorizeToWhiteboard(req.body.accessToken, req.body.whiteboardId).then(result => {
            const {err} = result;
            if (err) {
                res.status(401).json({message: err});
            } else {
                TestModel.inviteUserToWhiteboard(req.body.username, req.body.whiteboardId).then(() => {
                    res.status(200).json({message: "User invited successfully"});
                })
            }
        });
    }
}


/*
    ----------------------------------------------------------------------------------------------------------------
    THESE ARE THE ONES FOR SOCKET IO
    ----------------------------------------------------------------------------------------------------------------
*/
exports.joinWhiteboard = (accessToken, whiteboardId, callback) => {
    authZ.authorizeToWhiteboard(accessToken, whiteboardId).then(result => {
        const {err} = result;
        if (err) {
            callback(err);
        } else {
            callback();
        }
    })
}

exports.lineStarted = (line, accessToken, whiteboardId, callback) => {
    authZ.authorizeNewLine(accessToken, whiteboardId).then(result => {
        const {lineId, err} = result;   // the authorizer generates fresh new line id
        if (err) {
            callback(undefined, err);
        } else {
            callback(lineId, undefined);
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
            TestModel.insertLine(whiteboardId, lineId, line).then(result => {
                if (result.err) {
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
            TestModel.deleteLine(whiteboardId, lineId).then(result => {
                if (result.err) {
                    callback(result.err)
                } else {
                    callback();
                }
            })
        }
    });
}