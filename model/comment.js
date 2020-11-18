const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    email: String,
    idsanpham: String,
    rate: Number,
    nhanxet: String,
    madonhang: String
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updateAt'
    }
});

module.exports = mongoose.model('Comment', CommentSchema, 'comment');