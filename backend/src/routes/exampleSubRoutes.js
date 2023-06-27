const express = require('express');
const subController = require('../controllers/exampleController');
const router = express.Router();

// endpoints for /example/*

router.route('/')
    .get(subController.showSubStuff);

router.route('/:id')
    .get(subController.printId)
module.exports = router;