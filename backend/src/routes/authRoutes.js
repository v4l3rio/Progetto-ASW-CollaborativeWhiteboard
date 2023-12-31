const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();


// endpoints for /example/*

router.route('/login')
    .post(authController.login);

router.route('/register')
    .post(authController.register)

router.route('/logout')
    .post(authController.logout)

router.route('/refresh')
    .post(authController.refresh)
module.exports = router;