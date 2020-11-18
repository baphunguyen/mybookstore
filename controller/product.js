const Product = require('../model/product');
const Comment = require('../model/comment');
const User = require('../model/user');
const ProductHot = require('../model/producthot');
const ProductLike = require('../model/likeproduct');
const ProductNotSell = require('../model/product_notsell');

exports.spmoinhat = async function(req, res) {
    const page = req.body.page;
    const product = await Product.find({}, {tensp:1, hinhanhsanpham:1, tacgia:1, gia:1, tenurl:1, _id:0}).sort({createdAt:-1}).limit(6).skip(6*page);
    return res.json({product: product});
}

exports.sphot = async function(req, res) {
    const producthot = await ProductHot.find({}, {createdAt:0, updateAt:0, __v:0, _id:0}).sort({solanmua:-1}).limit(6);
    var arrayhot = [];
    for (var i of producthot) {
        const product = await Product.findOne({_id: i.idsanpham}, {tensp:1, hinhanhsanpham:1, tacgia:1, gia:1, tenurl:1, _id:0});
        arrayhot = arrayhot.concat(product);
    }
    return res.json({product: arrayhot});
}

exports.chitietsp = async function(req, res) {
    const sanpham = await Product.findOne({tenurl: req.body.tenurl}, {createdAt:0, updateAt:0, __v:0, tenurl:0});
    const array = await sanpham.urlloaisp.split('/');
    const n = await Product.countDocuments({urlloaisp: {$regex: array[0]}});
    const r = Math.floor(Math.random()*n/2);
    const sanphamlienquan = await Product.find({$and: [{urlloaisp: {$regex: array[0]}}, {tenurl: {$nin: req.body.tenurl}}]}, {tensp:1, hinhanhsanpham:1, tacgia:1, gia:1, tenurl:1}).limit(6).skip(r);
    const listcomment = await Comment.find({idsanpham: sanpham._id});
    var islike = false;
    if (req.body.email !== null) {
        const isproductlike = await ProductLike.findOne({$and: [{idsanpham: sanpham._id}, {email: req.body.email}]});
        if (isproductlike) islike = true;
    }
    var arrayrate = [0,0,0,0,0];
    for (const i of listcomment) {
        arrayrate[i.rate-1] += 1;
    }
    var isnotsell = false;
    const product_notsell = await ProductNotSell.findOne({tenurl: req.body.tenurl});
    if (product_notsell) isnotsell = true;
    return res.json({
        data: sanpham,
        datalienquan: sanphamlienquan,
        datarate: arrayrate,
        islike: islike,
        isnotsell: isnotsell
    });
}

exports.showcomment = async function(req, res) {
    const sanpham = await Product.findOne({tenurl: req.body.tenurl}, {_id:1});
    const page = req.body.page;
    var arraycomment = [];
    const listcomment = await Comment.find({idsanpham: sanpham._id}).limit(5).skip(5*page);
    for (const i of listcomment) {
        var user = await User.findOne({email: i.email}, {name:1, picture:1, _id:0});
        const convert = JSON.parse(JSON.stringify(user));
        convert.rate = i.rate;
        convert.nhanxet = i.nhanxet;
        user = convert;
        arraycomment = await arraycomment.concat(user);
    }
    return res.json({datacomment: arraycomment});
}

exports.showproductparent = async function(req, res) {
    const string = req.body.urlloaisp + '/';
    const product = await Product.find({urlloaisp : {$regex: string}}, {tensp:1, hinhanhsanpham:1, tacgia:1, gia:1, tenurl:1, _id:1}).sort({createdAt:-1});
    if (product.length === 0) {
        res.json({data: 'error'});
    } else {
        res.json({data: product});
    }
}

exports.showproductchild = async function(req, res) {
    const product = await Product.find({urlloaisp : {$regex: req.body.urlloaisp}}, {tensp:1, hinhanhsanpham:1, tacgia:1, gia:1, tenurl:1, _id:1}).sort({createdAt:-1});
    if (product.length === 0) {
        res.json({data: 'error'});
    } else {
        res.json({data: product});
    }
}

exports.productlike = async function(req, res) {
    const sanpham = await Product.findOne({tenurl: req.body.tenurl}, {_id:1});
    const islike = await ProductLike.findOne({$and: [{idsanpham: sanpham._id}, {email: req.body.email}]});
    if (!islike) {
        const likeproduct = new ProductLike();
        likeproduct.idsanpham = sanpham._id;
        likeproduct.email = req.body.email;
        await likeproduct.save();
        return res.json({data: 'success'})
    } else {
        await ProductLike.deleteOne({$and: [{idsanpham: sanpham._id}, {email: req.body.email}]})
        return res.json({data: 'deletesuccess'})
    }
}

exports.listproductlike = async function(req, res) {
    const productlike = await ProductLike.find({email: req.body.email}, {email:1, idsanpham:1, _id:0});
    var arrayproductlike = [];
    for (var i of productlike) {
        const product = await Product.findOne({_id: i.idsanpham}, {tensp:1, hinhanhsanpham:1, gia:1, tacgia:1, tenurl:1, _id:0});
        arrayproductlike = arrayproductlike.concat(product);
    }
    return res.json({datalike: arrayproductlike});
}

exports.searchproduct = async function(req, res, next) {
    try {
        const filter = req.body.filter;
        const product = await Product.find({$text: {$search: filter}});
        return res.json({data: product});
    } catch(err) {
        next(err);
    }
}