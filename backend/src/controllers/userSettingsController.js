const { response } = require('express')
const {TestModel} = require ("../models/testModel");
const {auth} = require('./authController')

exports.getUserData =  (req, res) => {
    if (req.query.accessToken) {
        auth.validateAccessToken(req.query.accessToken).then(result => {
            if (result.err) {
                res.status(401).json({message: "Invalid Access Token"})
            } else {
                console.log(result.user.username)
                TestModel.findOneUser(result.user.username).then(user => {
                    res.status(200).json(user);
                })
            }
        })
    } else {
        res.status(400).json({message: "Missing access token in the request"})
    }
}
exports.updateInfo = (req, res) => {
    if (req.body.accessToken) {
        auth.validateAccessToken(req.body.accessToken).then(result => {
            if (result.err) {
                res.status(401).json({message: "Invalid Access Token"})
            } else {
                TestModel.updateUserInfo(req.body.username, req.body.username, req.body.first_name, req.body.last_name).then(user => {
                    res.status(200).json(user);
                })
            }
        })
    } else {
        res.status(400).json({message: "Missing access token in the request"})
    }

}
exports.updatePassword = (req, res) => {
    if (req.body.accessToken) {
        auth.validateAccessToken(req.body.accessToken).then(result => {
            if (result.err) {
                res.status(401).json({message: "Invalid Access Token"})
            } else {
                TestModel.updateUserPassword(req.body.username, req.body.password).then(() => {
                    if (result.err) {
                        res.status(401).json({message: "Somthing went wrong"})
                    } else {
                        res.status(200).json({message: "User informations updated successfully"});
                    }
                })
            }
        })
    } else {
        res.status(400).json({message: "Missing access token in the request"})
    }
    
}

