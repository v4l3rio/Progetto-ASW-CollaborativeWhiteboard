const {Authorizer} = require("../auth/Authorizer");
const {TestModel} = require("../models/testModel");

const authZ = new Authorizer(TestModel);
exports.authZ = authZ;
/* TODO if everyone can operate freely on the whiteboard, then all the authorize methods
    can be collapsed in one
 */

exports.getWhiteboardData = (req, res) => {
    // todo express route
}

exports.joinWhiteboard = (accessToken, whiteboardId, callback) => {
    authZ.authorizeToWhiteboard(accessToken, whiteboardId).then(result => {
        const {err} = result;
        if (err) {
            callback(null, err);
        } else {
            const whiteboardData = {} // get from DB
            callback(whiteboardData, undefined);
        }
    })
}

exports.lineStarted = (line, accessToken, whiteboardId, callback) => {
    authZ.authorizeNewLine(accessToken, whiteboardId).then(result => {
        const {lineId, err} = result;   // the authorizer generates fresh new line id
        if (err) {
            callback(undefined, err);
        } else {
            const {point, color} = line;
            // todo broadcast the line (done by the realtime)
            callback(lineId, undefined);
        }
    })
}

// maybe unnecessary
exports.lineMove = (line, lineId, whiteboardId, callback) => {
    const {point, color} = line;
    // todo add maybe the authorization also in line move?
    callback();
}

exports.lineEnd = (line, accessToken, lineId, whiteboardId, callback) => {
    authZ.authorizeLineEnd(accessToken, lineId, whiteboardId).then(result => {
        if (result.err) {
            callback(result.err)
        } else {
            callback()
        }
    });
}

exports.lineDelete = (lineId, accessToken, whiteboardId, callback) => {
    authZ.authorizeLineDelete(accessToken, lineId, whiteboardId).then(result => {
        if (result.err) {
            callback(result.err);
        } else {
            callback();
        }
    });
}