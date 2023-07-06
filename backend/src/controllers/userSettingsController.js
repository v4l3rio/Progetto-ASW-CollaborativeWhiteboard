const { response } = require('express')
const {TestModel} = require ("../models/testModel");
const {auth} = require('./authController')

exports.getUserData =  (req, res) => {
    if (req.query.accessToken) {
        auth.validateAccessToken(req.query.accessToken).then(result => {
            if (result.err) {
                res.status(401).json({message: "Invalid Access Token"})
            } else {
                TestModel.findOneUser(result.user.username).then(user => {
                    res.status(200).json(user);
                })
            }
        })
    } else {
        res.status(400).json({message: "Missing access token in the request"})
    }
}

