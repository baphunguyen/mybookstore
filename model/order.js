const mongoose = require('mongoose');

const OrtherSchema = mongoose.Schema({
    email: String,
    ten: String,
    diachi: String,
    dienthoai: String,
    ghichu: String,
    idcart: Array,
    thanhtoan: String,
    tongtien: Number,
    trangthai: String
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updateAt'
    }
});

module.exports = mongoose.model('Order', OrtherSchema, 'order');