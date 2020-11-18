const Product = require('../model/product');
const Cart = require('../model/cart');

exports.addcart = async function(req, res) {
    const cart = await Cart.findOne({$and: [{email: req.body.email}, {idsanpham: req.body.idsanpham}]});
    if (cart) {
        cart.soluongsanpham = cart.soluongsanpham + parseInt(req.body.soluongsanpham);
        await cart.save();
        res.json({data: "success"});
    } else {
        const product = await Product.findOne({_id: req.body.idsanpham}, {tensp:1, hinhanhsanpham:1, gia:1, tenurl:1});
        const cartnew = new Cart(req.body);
        cartnew.tensp = product.tensp;
        cartnew.hinhanhsanpham = product.hinhanhsanpham;
        cartnew.gia = product.gia;
        cartnew.slug = product.tenurl;
        cartnew.save();
        res.json({data: "addcartsuccess"});
    }
}

exports.showcart = async function(req, res) {
    const cart = await Cart.find({email: req.body.email}, {createdAt:0, updateAt:0, __v:0, _id:0});
    res.json({data: cart});
}

exports.deleteonecart = async function(req, res) {
    const deletecart = await Cart.deleteOne({$and: [{email: req.body.email}, {idsanpham: req.body.idsanpham}]});
    if (deletecart) {
        return res.json({data: "success"});
    } else {
        return res.json({data: "error"});
    }
}

exports.deleteallcart = async function(req, res) {
    const deleteallcart = await Cart.deleteMany({email: req.body.email});
    if (deleteallcart) {
        return res.json({data: "success"});
    } else {
        return res.json({data: "error"});
    }
}

exports.updatecart = async function(req, res) {
    const cart = await Cart.findOne({$and: [{email: req.body.email}, {idsanpham: req.body.idsanpham}]});
    if (cart) {
        cart.soluongsanpham = parseInt(req.body.soluongsanpham);
        cart.save();
        res.json({data: "success"});
    }
}

exports.sanphamlienquan = async function(req, res) {
    const sanpham = await Product.findOne({tenurl: req.body.tenurl}, {urlloaisp:1, _id:0});
    const array = await sanpham.urlloaisp.split('/');
    const n = await Product.countDocuments({urlloaisp: {$regex: array[0]}});
    const r = Math.floor(Math.random()*n/2);
    const sanphamlienquan = await Product.find({$and: [{urlloaisp: {$regex: array[0]}}, {tenurl: {$nin: req.body.tenurl}}]}, {tensp:1, hinhanhsanpham:1, tacgia:1, gia:1, tenurl:1}).limit(6).skip(r);
    res.json({datalienquan: sanphamlienquan});
}