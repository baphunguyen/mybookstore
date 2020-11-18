const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    idsocial: String,
    name: String,
    email: String,
    password: String,
    phone: String,
    picture: String,
    secretToken: String,
    active: Boolean,
    diachi: Array
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updateAt'
    }
});

exports.findById = (id) => {
    return User.findById(id).then((result) => {
        result = result.toJSON();
        delete result._id;
        return result;
    });
};

module.exports = mongoose.model('User', UserSchema, 'user');
module.exports.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    } catch(error) {
        throw new Error('Hashing failed', error);
    }
}