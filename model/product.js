const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
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
ProductSchema.index({tensp: 'text'});

module.exports = mongoose.model('Product', ProductSchema, 'product');