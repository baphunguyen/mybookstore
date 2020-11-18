const express = require('express');
const router = express.Router();
const {showalldataorder, adddata, editproduct, product_notsell, showalldatacount, showalldataproduct, deleteorder, chitietdonhang, editorder, editchitietdonhang, dropdownproduct, deletechitietdonhang} = require('../controller/webadmin');

router.get('/showalldataorder', showalldataorder);

router.post('/showalldataproduct', showalldataproduct);

router.get('/showalldatacount', showalldatacount);

router.post('/adddata', adddata);

router.post('/editproduct', editproduct);

router.post('/product_notsell', product_notsell);

router.post('/deleteorder', deleteorder);

router.post('/chitietdonhang', chitietdonhang);

router.post('/editorder', editorder);

router.post('/editchitietdonhang', editchitietdonhang);

router.get('/dropdownproduct', dropdownproduct);

router.post('/deletechitietdonhang', deletechitietdonhang)

module.exports = router;