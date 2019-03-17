'use strict';

const express = require('express');
const router = express.Router();
const controller = require('../controllers/parserController');

router.get('/api', controller.getParser);

module.exports = router;
