const mongoose = require('mongoose');

const ProductNotSellSchema = mongoose.Schema({
    idsanpham: String,
    tensp: String,
    tacgia: String,
    nxb: String,
    tenurl: String,
    namxb: String,
    kichthuoc: String,
    nhacungcap: String,
    hinhanhsanpham: String,
    gia: Number,
    loaibia: String,
    sotrang: Number,
    mota: String,
    urlloaisp: String,
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updateAt'
    }
})

module.exports = mongoose.model('Product_Notsell', ProductNotSellSchema, 'product_notsell');