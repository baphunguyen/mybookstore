const express = require('express');
const router = express.Router();
const {spmoinhat,sphot, chitietsp, showproductparent, showproductchild, showcomment, productlike, listproductlike, searchproduct} = require('../controller/product');

router.post('/spmoinhat', spmoinhat);

router.get('/sphot', sphot);

router.post('/showcomment', showcomment);

router.post('/chitietsp', chitietsp);

router.post('/showproductparent', showproductparent);

router.post('/showproductchild', showproductchild);

router.post('/productlike', productlike);

router.post('/listproductlike', listproductlike);

router.post('/searchproduct', searchproduct);

module.exports = router;