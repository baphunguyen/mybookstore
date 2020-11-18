const mongoose = require('mongoose');

const LikeProductSchema = mongoose.Schema({
    email: String,
    idsanpham: String
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updateAt'
    }
})

module.exports = mongoose.model('ProductLike', LikeProductSchema, 'productlike');