const express = require('express');
const whiteboardController = require('../controllers/whiteboardController');
const router = express.Router();

router.route("/invite")
    .put(whiteboardController.inviteToWhiteboard)

router.route("/:id")
    .get(whiteboardController.getWhiteboardData)

module.exports = router;