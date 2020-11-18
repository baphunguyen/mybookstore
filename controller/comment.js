const Product = require('../model/product');
const Comment = require('../model/comment');
const Order = require('../model/order');

exports.comment = async function (req, res, next) {
    try {
        const sanpham = await Product.findOne({tenurl: req.body.tenurl}, {_id:1});
        const comment = new Comment();
        comment.email = req.body.email;
        comment.idsanpham = sanpham._id;
        comment.rate = req.body.rate;
        comment.nhanxet = req.body.nhanxet;
        comment.madonhang = req.body.madonhang;
        const donhang = await Order.findOne({_id: req.body.madonhang});
        var i = 0;
        var arr = [];
        var arrcart = donhang.idcart;
        for (const product of arrcart) {
            if (product.idsanpham === comment.idsanpham) {
                arr = product;
                arr.iscomment = true;
                break;
            } else {
                i++;
            }
        }
        arrcart[i] = arr;
        donhang.idcart = undefined;
        donhang.idcart = arrcart;
        await donhang.save();
        await comment.save();
        res.json({data: 'success'});
    } catch(err) {
        next(err);
    }
}