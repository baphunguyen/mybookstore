const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
    email: String,
    idsanpham: String,
    soluongsanpham: Number,
    tensp: String,
    hinhanhsanpham: String,
    gia: Number,
    slug: String,
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updateAt'
    }
});

module.exports = mongoose.model('Cart', CartSchema, 'cart');