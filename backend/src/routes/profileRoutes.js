const express = require('express');
const profileController = require('../controllers/profileController');
const router = express.Router();

router.route('/')
    .post(profileController.getProfile);

router.route('/createWhiteboard')
    .put(profileController.createWhiteboard);

router.route('/updateWhiteboard')
    .put(profileController.updateWhiteboard)

router.route('/deleteWhiteboard')
    .delete(profileController.deleteWhiteboard)

module.exports = router;
