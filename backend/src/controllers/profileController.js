
const {Model} = require ("../models/model");
const {log, logErr} = require("../util/consoleUtil");
const {auth} = require('./authController')
const {authZ} = require('./whiteboardController')

const DEFAULT_WHITEBOARD_NAME = "Lavagna di Prova";

exports.getProfile = (req, res) => {
    if (req.query.accessToken) {
        auth.validateAccessToken(req.query.accessToken).then(result => {
            if (result.err) {
                res.status(401).json({message: "Invalid Access Token"})
            } else {
                if (result.user) {
                    Model.getWhiteboards(result.user.username).then(whiteboards => {
                        res.status(200).json({whiteboards: whiteboards});
                    })
                }
            }
        })
    } else {
        res.status(400).json({message: "Missing access token in the request"})
    }
}

exports.createWhiteboard = (req, res) => {
    if (req.body.accessToken) {
        auth.validateAccessToken(req.body.accessToken).then(result => {
            if (result.err) {
                res.status(401).json({message: "Invalid Access Token"})
            } else {
                if (result.user) {
                    const whiteboardName = req.body.whiteboardName ? req.body.whiteboardName : DEFAULT_WHITEBOARD_NAME
                    Model.createWhiteboard(whiteboardName, result.user.username).then(result => {
                        if (result) {
                            res.status(200).json({message: "Message created successfully", whiteboardId: result.id});
                        } else {
                            res.status(500).end();
                        }
                    })
                }
            }
        })
    } else {
        res.status(400).json({message: "Missing access token in the request"})
    }
}

exports.updateWhiteboard = (req, res) => {
    if (req.body.accessToken) {
        auth.validateAccessToken(req.body.accessToken).then(result => {
            if (result.err) {
                res.status(401).json({message: "Invalid Access Token"})
            } else {
                if (req.body.whiteboardId !== undefined) {
                    authZ.ownerToWhiteboard(req.body.accessToken, req.body.whiteboardId).then(result => {
                        log(req.body.newName + " " + req.body.whiteboardId);
                        Model.updateWhiteboard(req.body.whiteboardId, req.body.newName).then(() => {
                            res.status(200).json({message: "Whiteboard updated successfully"});
                        })
                    })
                } else {
                    res.status(400).json({message: "Missing ID of the whiteboard in the request"})
                }
            }
        })
    } else {
        res.status(400).json({message: "Missing access token in the request"})
    }
}

exports.deleteWhiteboard = (req, res) => {
    if (req.body.accessToken) {
        auth.validateAccessToken(req.body.accessToken).then(result => {
            if (result.err) {
                res.status(401).json({message: "Invalid Access Token"})
            } else {
                if (req.body.whiteboardId !== undefined) {
                    authZ.ownerToWhiteboard(req.body.accessToken, req.body.whiteboardId).then(result => {
                        Model.deleteWhiteboard(req.body.whiteboardId).then(() => {
                            res.status(200).json({message: "Whiteboard deleted successfully"});
                        })
                    })
                } else {
                    res.status(400).json({message: "Missing ID of the whiteboard in the request"})
                }
            }
        })
    } else {
        res.status(400).json({message: "Missing access token in the request"})
    }
}

exports.getUserWithFilters = (req, res) => {
    if (req.query.accessToken) {
        auth.validateAccessToken(req.query.accessToken).then(result => {
            if (result.err) {
                res.status(401).json({message: "Invalid Access Token"})
            } else {
                const filters = req.query.filters;
                filters["excludes"] = result.user.username;

                Model.getUsersWithFilters(filters).then(result => {
                    if (result.err) {
                        res.status(500).json({message: "Cannot get users"})
                    } else {
                        res.status(200).json({users: result.users});
                    }
                })
            }
        })
    } else {
        res.status(400).json({message: "Missing access token in the request"})
    }
}
