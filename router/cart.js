const express = require('express');
const router = express.Router();
const {addcart, showcart, deleteonecart, deleteallcart, updatecart, sanphamlienquan} = require('../controller/cart');

router.post('/addcart', addcart);

router.post('/showcart', showcart);

router.post('/deleteonecart', deleteonecart);

router.post('/deleteallcart', deleteallcart);

router.post('/updatecart', updatecart);

router.post('/sanphamlienquan', sanphamlienquan);

module.exports = router;