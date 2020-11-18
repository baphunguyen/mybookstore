const Cart = require('../model/cart');
const Orther = require('../model/order');
const Product = require('../model/product');
const ProductHot = require('../model/producthot');

exports.orther = async function (req, res) {
    const allcart = await Cart.find({email: req.body.email}, {idsanpham:1, soluongsanpham: 1, _id:0, gia: 1});
    if (!allcart) {
        return res.json({data: 'error'});
    }
    var arriscomment = [];
    for (var i of allcart) {
        const producthot = await ProductHot.findOne({idsanpham: i.idsanpham});
        console.log(producthot);
        if (producthot === null) {
            const product = new ProductHot();
            product.idsanpham = i.idsanpham;
            product.solanmua = i.soluongsanpham;
            await product.save();
        } else {
            producthot.solanmua += i.soluongsanpham;
            producthot.save();
        }
        const convert = JSON.parse(JSON.stringify(i));
        convert.iscomment = false;
        arriscomment = arriscomment.concat(convert);
    }
    const orther = new Orther(req.body);
    orther.idcart = arriscomment;
    orther.trangthai = "Tiếp nhận đơn hàng";
    await Cart.deleteMany({email: req.body.email});
    await orther.save();
    res.json({data: orther._id});
}

exports.orderproduct = async function (req, res) {
    const order = await Orther.findOne({_id: req.body.id}, {updateAt:0, __v:0, email:0, idcart:0, _id:0});
    const arraycart = await Orther.findOne({_id: req.body.id}, {idcart:1, _id:0});
    const arr = arraycart.idcart;
    var arrproduct = [];
    for (const i of arr) {
        var product = await Product.findOne({_id: i.idsanpham}, {tensp:1, tenurl:1, hinhanhsanpham:1, _id:0});
        const convert = JSON.parse(JSON.stringify(product));
        convert.soluongsanpham = i.soluongsanpham;
        convert.gia = i.gia;
        convert.iscomment = i.iscomment;
        product = convert;
        arrproduct = await arrproduct.concat(product);
    }
    res.json({
        datainfo: order,
        dataproduct: arrproduct
    });
}

exports.lichsugiaodich = async function (req, res) {
    const user = await Orther.find({email: req.body.email}, {createdAt:1, tongtien:1, idcart:1, trangthai: 1});
    var array = [];
    for (const i of user) {
        var product = await Product.findOne({_id: i.idcart[0].idsanpham}, {tensp:1});
        const convert = JSON.parse(JSON.stringify(i));
        convert.tensp = product.tensp;
        delete convert.idcart;
        array = await array.concat(convert);
    }
    res.json({data: array});
}