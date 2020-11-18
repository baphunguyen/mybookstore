const express = require('express');
const router = express.Router();
const {orther, orderproduct, lichsugiaodich} = require('../controller/order');

router.post('/orther', orther);

router.post('/orderproduct', orderproduct);

router.post('/lichsugiaodich', lichsugiaodich);

module.exports = router;