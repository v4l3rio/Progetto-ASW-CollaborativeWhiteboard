const express = require('express');
const profileController = require('../controllers/profileController');
const router = express.Router();

router.route('/')
    .get(profileController.getProfile);

router.route('/createWhiteboard')
    .post(profileController.createWhiteboard);

router.route('/updateWhiteboard')
    .put(profileController.updateWhiteboard)

router.route('/deleteWhiteboard')
    .delete(profileController.deleteWhiteboard)

router.route('/users')
    .get(profileController.getUserWithFilters);

router.route('/notifications')
    .get(profileController.getNotificationOfUser);

module.exports = router;
