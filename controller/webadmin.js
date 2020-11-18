const User = require('../model/user')
const Product = require('../model/product')
const Product_Notsell = require('../model/product_notsell')
const Order = require('../model/order')
const Joi = require('joi');

const ProductValidate = Joi.object().keys({
    tensp: Joi.string().required(),
    tacgia: Joi.string().required(),
    tenurl: Joi.string().required(),
    nxb: Joi.string().required(),
    namxb: Joi.string().required(),
    kichthuoc: Joi.string().required(),
    nhacungcap: Joi.string().required(),
    hinhanhsanpham: Joi.string().required(),
    gia: Joi.number().required(),
    loaibia: Joi.string().required(),
    sotrang: Joi.number().required(),
    mota: Joi.string().required(),
    urlloaisp: Joi.string().required()
});

exports.adddata = async function(req, res) {
    const result = Joi.validate(req.body, ProductValidate);
    if (result.error) {
        console.log(result.error);
        res.json({data: 'error'})
        return;
    }
    const product = new Product(result.value);
    await product.save();
    res.json({data: 'success'})
}

exports.showalldataproduct = async function(req, res) {
    const string = req.body.urlloaisp + '/';
    const product = await Product.find({urlloaisp : {$regex: string}}, {createdAt:0, updateAt:0, __v:0}).sort({createdAt:-1});
    var arrproduct = [];
    var isnotsell = false;
    for (const i of product) {
        const product_notsell = await Product_Notsell.findOne({tenurl: i.tenurl});
        if (product_notsell) isnotsell = true;
        const convert = JSON.parse(JSON.stringify(i));
        convert.isnotsell = isnotsell;
        isnotsell = false;
        arrproduct = await arrproduct.concat(convert);
    }
    if (product.length === 0) {
        res.json({data: 'error'});
    } else {
        res.json({data: arrproduct});
    }
}

exports.showalldataorder = async function(req, res, next) {
    try {
        //const user = await User.find({}, {createdAt:0, updateAt:0, __v:0}).sort({createdAt: -1});
        //const product = await Product.find({}, {createdAt:0, updateAt:0, __v:0}).sort({createdAt: -1});
        const order = await Order.find({}, {createdAt:0, updateAt:0, __v:0}).sort({createdAt: -1});
        res.json({
            //datauser: user,
            //dataproduct: product,
            dataorder: order
        })
    } catch(err) {
        next(err);
    }
}

exports.showalldatacount = async function(req, res) {
    const countuser = await User.countDocuments();
    const countproduct = await Product.countDocuments();
    const countorder = await Order.countDocuments();
    res.json({
        datacountuser: countuser,
        datacountproduct: countproduct,
        datacountorder: countorder
    })
}


exports.editproduct = async function(req, res) {
    const product = await Product.findOne({_id: req.body.id});
    if (typeof req.body.tensp !== 'undefined') product.tensp = req.body.tensp;
    if (typeof req.body.tacgia !== 'undefined') product.tacgia = req.body.tacgia;
    if (typeof req.body.tenurl !== 'undefined') product.tenurl = req.body.tenurl;
    if (typeof req.body.urlloaisp !== 'undefined') product.urlloaisp = req.body.urlloaisp;
    if (typeof req.body.nxb !== 'undefined') product.nxb = req.body.nxb;
    if (typeof req.body.namxb !== 'undefined') product.namxb = req.body.namxb;
    if (typeof req.body.kichthuoc !== 'undefined') product.kichthuoc = req.body.kichthuoc;
    if (typeof req.body.nhacungcap !== 'undefined') product.nhacungcap = req.body.nhacungcap;
    if (typeof req.body.hinhanhsanpham !== 'undefined') product.hinhanhsanpham = req.body.hinhanhsanpham;
    if (typeof req.body.gia !== 'undefined') product.gia = req.body.gia;
    if (typeof req.body.loaibia !== 'undefined') product.loaibia = req.body.loaibia;
    if (typeof req.body.sotrang !== 'undefined') product.sotrang = req.body.sotrang;
    if (typeof req.body.mota !== 'undefined') product.mota = req.body.mota;
    await product.save();
    res.json({data: 'success'})
}

exports.product_notsell = async function(req, res) {
    const product = await Product.findOne({_id: req.body.id}, {createdAt:0, updateAt:0, __v:0});
    const product_notsell = new Product_Notsell();
    product_notsell.idsanpham = product._id;
    product_notsell.tensp = product.tensp;
    product_notsell.tacgia = product.tacgia;
    product_notsell.nxb = product.nxb;
    product_notsell.tenurl = product.tenurl;
    product_notsell.namxb = product.namxb;
    product_notsell.kichthuoc = product.kichthuoc;
    product_notsell.nhacungcap = product.nhacungcap;
    product_notsell.hinhanhsanpham = product.hinhanhsanpham;
    product_notsell.gia = product.gia;
    product_notsell.loaibia = product.loaibia;
    product_notsell.sotrang = product.sotrang;
    product_notsell.mota = product.mota;
    product_notsell.urlloaisp = product.urlloaisp;
    await product_notsell.save();
    res.json({data: 'success'})
}

exports.deleteorder = async function(req, res) {
    const deleteorder = await Order.deleteOne({_id: req.body.id});
    if (deleteorder) {
        res.json({data: 'success'})
    } else {
        res.json({data: 'error'});
    }
}

exports.chitietdonhang = async function(req, res) {
    const arraycart = await Order.findOne({_id: req.body.id}, {idcart:1, _id:0});
    const arr = arraycart.idcart;
    var arrproduct = [];
    for (const i of arr) {
        var product = await Product.findOne({_id: i.idsanpham}, {tensp:1, hinhanhsanpham:1, _id:1});
        const convert = JSON.parse(JSON.stringify(product));
        convert.soluongsanpham = i.soluongsanpham;
        convert.gia = i.gia;
        convert.iscomment = i.iscomment;
        product = convert;
        arrproduct = await arrproduct.concat(product);
    }
    res.json({data: arrproduct});
}

exports.editorder = async function(req, res) {
    const order = await Order.findOne({_id: req.body.id}, {createdAt:0, updateAt:0, __v:0});
    if (order) {
        if (typeof req.body.email !== 'undefined') order.email = req.body.email;
        if (typeof req.body.ten !== 'undefined') order.ten = req.body.ten;
        if (typeof req.body.diachi !== 'undefined') order.diachi = req.body.diachi;
        if (typeof req.body.dienthoai !== 'undefined') order.dienthoai = req.body.dienthoai;
        if (typeof req.body.ghichu !== 'undefined') order.ghichu = req.body.ghichu;
        if (typeof req.body.thanhtoan !== 'undefined') order.thanhtoan = req.body.thanhtoan;
        if (typeof req.body.trangthai !== 'undefined') order.trangthai = req.body.trangthai;
        await order.save();
        res.json({data: 'success'})
    }
}

exports.editchitietdonhang = async function(req, res) {
    const order = await Order.findOne({_id: req.body.id}, {createdAt:0, updateAt:0, __v:0});
    const arraycart = await Order.findOne({_id: req.body.id}, {idcart:1, _id:0});
    var arrupdatecart = [];
    var tongtien = 0;
    const arr = arraycart.idcart;
    for (const i of arr) {
        if (i.idsanpham === req.body.idsanpham) {
            if (typeof req.body.idsanphamnew !== 'undefined') {
                i.idsanpham = req.body.idsanphamnew;
                const product = await Product.findOne({_id: req.body.idsanphamnew});
                i.gia = product.gia
            }
            if (typeof req.body.soluongsanpham !== 'undefined') i.soluongsanpham = req.body.soluongsanpham;
            if (typeof req.body.iscomment !== 'undefined') {
                i.iscomment = (req.body.iscomment === '1') ? true : false;
            }
        }
        tongtien += (i.gia*i.soluongsanpham);
        arrupdatecart = await arrupdatecart.concat(i);
    }
    order.idcart = arrupdatecart;
    order.tongtien = tongtien;
    await order.save();
    res.json({data: 'success'});
}

exports.dropdownproduct = async function(req, res) {
    const product = await Product.find({}, {tensp:1});
    res.json({data: product});
}

exports.deletechitietdonhang = async function(req, res){
    const order = await Order.findOne({_id: req.body.id}, {createdAt:0, updateAt:0, __v:0});
    const arraycart = await Order.findOne({_id: req.body.id}, {idcart:1, _id:0});
    var arrupdatecart = [];
    var tongtien = 0;
    const arr = arraycart.idcart;
    for (const i of arr) {
        if (i.idsanpham === req.body.idsanpham) continue;
        tongtien += (i.gia*i.soluongsanpham);
        arrupdatecart = await arrupdatecart.concat(i);
    }
    order.idcart = arrupdatecart;
    order.tongtien = tongtien;
    await order.save();
    if (order.tongtien === 0) {
        await Order.deleteOne({_id: req.body.id});
    }
    res.json({data: 'success'});
}