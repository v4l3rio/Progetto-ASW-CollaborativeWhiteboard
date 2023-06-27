const express = require('express');
const indexController = require('../controllers/indexController');
const router = express.Router();


router.route('/')
    .get(indexController.showIndex);
module.exports = router;