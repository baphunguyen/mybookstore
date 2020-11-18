const express = require('express');
const router = express.Router();
const {comment} = require('../controller/comment');

router.post('/comment', comment);

module.exports = router;