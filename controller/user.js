const User = require('../model/user');
const Cart = require('../model/cart');
const Joi = require('joi');
const randomstring = require('randomstring');
const mailer = require('./mailer');
const bcrypt = require('bcryptjs')


const UserValidate = Joi.object().keys({
    name: Joi.string().required().max(50),
    email: Joi.string().email().required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    password_confirm: Joi.any().valid(Joi.ref('password')).required(),
    phone: Joi.string().alphanum().required()
});


exports.register = async function(req, res, next) {
    try {
        const result = Joi.validate(req.body, UserValidate);
        if (result.error) {
            res.json({err: 'Data is invalid, Please again'})
            return;
        }

        const checkemail = await User.findOne({email: result.value.email});
        if (checkemail) {
            return res.json({err: 'Email is used. Please again'});
        }
        const hash = await User.hashPassword(result.value.password);

        const secretToken = randomstring.generate(10);
        result.value.secretToken = secretToken;

        result.value.active = false;

        delete result.value.password_confirm;
        result.value.password = hash;
        const user = new User(result.value);
        await user.save();

        const html = `Hi there,
        <br/>
        Thanks you for registering
        <br/><br/>
        Please verify your email using secret Token:
        <br/>
        secretToken: ${secretToken}
        <br/>`

        //send the email
        await mailer.senEmail('mybookstore.onl@gmail.com', result.value.email, 'Please verify your email', html);
        res.json({message: 'Data is added to database'})
    } catch(err) {
        next(err);
    }
}

exports.verify = async function(req, res, next) {
    try {
        const {secretToken} = req.body;
        const user = await User.findOne({'secretToken' : secretToken});
        if (!user) {
            return res.json({err: 'Token is not corrected, Please again'});
        }
        user.active = true;
        user.secretToken = '';
        await user.save();
        res.json({message: 'Account is vefied'})
    } catch(err) {
        next(err);
    }
}

exports.login = async function (req, res, next) {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        return res.json({err: 'Account is not corrected, Please again'});
    }
    if (user.idsocial !== undefined) {
        return res.json({err: 'Email is used by social account'});
    }
    if (!user.active) {
        return res.json({err: 'Please verify your account'});
    }
    const checkpass = await bcrypt.compare(req.body.password, user.password);
    if (!checkpass) {
        return res.json({err: 'Email and Password are incorrect'});
    }
    req.session.user = user;
    const product = await Cart.countDocuments({email: user.email});
    const array = [user.email, user.name, user.phone, product, user.diachi];
    res.json({data: array});
}

exports.logout = function (req, res) {
    if (req.session) {
        req.session.destroy(function(err) {
            if (err) {
                return res.json({err});
            } else {
                return res.json({err: 'success'});
            }
        });
    }
}

exports.socialnetwork = async function(req, res) {
    const user = await User.findOne({idsocial: req.body.id});
    const checkemail = await User.findOne({email: req.body.email});
    if (!user && !checkemail) {
        const usernew = new User();
        usernew.idsocial = req.body.id;
        usernew.name = req.body.name;
        usernew.email = req.body.email;
        usernew.picture = req.body.picture;
        usernew.save();
    }
    if (user) {
        req.session.user = user;
        const product = await Cart.countDocuments({email: user.email});
        return res.json({
            err: 'Data is added to database',
            dataphone: user.phone,
            datacount: product,
            datadiachi: user.diachi
        })
    } 
    if (checkemail) {
        return res.json({err: 'Email is used'});
    }
}

exports.forgotpassword = async function(req, res) {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        return res.json({err: 'No account with that email address exists.'});
    }

    const secretToken = randomstring.generate(6);

    const hash = md5(secretToken);
    user.password = hash;
    await user.save();
    res.json({err: 'success'});

    const html = `Hi there,
    <br/>
    Thanks you for reset password
    <br/><br/>
    Please using new password for your account:
    <br/>
    New password: ${secretToken}`

    //send the email
    await mailer.senEmail('mybookstore.onl@gmail.com', user.email, 'New password for account', html);
}

exports.changeprofile = async function(req, res) {
    const user = await User.findOne({email: req.body.email});
    user.name = req.body.name;
    user.phone = req.body.phone;
    user.diachi = req.body.diachi;
    user.save();
    return res.json({data: 'success'});
}

exports.checkpassword = async function(req, res) {
    const user = await User.findOne({email: req.body.email});
    const checkpass = await bcrypt.compare(req.body.password, user.password);
    if (!checkpass) {
        return res.json({data: 'Password is incorrect'});
    } else {
        return res.json({data: 'success'})
    }
}

exports.changepassword = async function(req, res) {
    const user = await User.findOne({email: req.body.email});
    const hash = await User.hashPassword(req.body.password);
    user.password = hash;
    await user.save();
    return res.json({data: 'success'})
}