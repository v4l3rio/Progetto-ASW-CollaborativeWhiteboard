
const {TestModel} = require ("../models/testModel");
const {log, logErr} = require("../util/consoleUtil");
const {auth} = require('./authController')
const {authZ} = require('./whiteboardController')

const DEFAULT_WHITEBOARD_NAME = "Lavagna di Prova";

exports.getProfile = (req, res) => {
    if (req.body.accessToken) {
        auth.validateAccessToken(req.body.accessToken).then(result => {
            if (result.err) {
                res.status(401).json({message: "Invalid Access Token"})
            } else {
                // TODO send profile data taken from the model
                res.status(200).json({whiteboards: {1: {name: "Lavagna di Prova"}, 2: {name: "Lavagna di Prova 2"}}});
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
                const whiteboardName = req.body.whiteboardName ? req.body.whiteboardName : DEFAULT_WHITEBOARD_NAME
                // TODO insert the whiteboard inside the model
                const id = 0 // todo get id as return value from the model
                res.status(200).json({message: "Message created successfully", whiteboardId: id});
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
                if (req.body.whiteboardId) {
                    authZ.authorizeToWhiteboard(req.body.accessToken, req.body.whiteboardId).then(result => {
                        // TODO update profile data inside the model

                        res.status(200).json({message: "Whiteboard updated successfully"});
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
                if (req.body.whiteboardId) {
                    authZ.authorizeToWhiteboard(req.body.accessToken, req.body.whiteboardId).then(result => {
                        // TODO delete whiteboard in the model

                        res.status(200).json({message: "Whiteboard deleted successfully"});
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
