const express = require('express');
const path = require('path');

const { verifyUser } = require('../modules/auth');

const router = express.Router();

// verify user before serving
router.use(verifyUser);

// serve our react app
router.use('/', express.static(path.join(__dirname, '..', '..', 'public')));

module.exports = router;
