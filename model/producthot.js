const mongoose = require('mongoose');

const ProductHotSchema = mongoose.Schema({
    idsanpham: String,
    solanmua: Number
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updateAt'
    }
})

module.exports = mongoose.model('ProductHot', ProductHotSchema, 'producthot');