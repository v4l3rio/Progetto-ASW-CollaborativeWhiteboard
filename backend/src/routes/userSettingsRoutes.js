const express = require('express');
const userSettingController = require('../controllers/userSettingsController');
const router = express.Router();

router.route('/')
    .get(userSettingController.getUserData);

module.exports = router;
