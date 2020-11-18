const express = require('express');
const passport = require('passport');
const router = express.Router();
const {register, verify, login, logout, socialnetwork, changeprofile, forgotpassword, changepassword, checkpassword} = require('../controller/user');

router.post('/register', register);

router.post('/verify', verify);

router.post('/login', login);

router.post('/socialnetwork', socialnetwork);

router.get('/logout', logout);

router.post('/forgotpassword', forgotpassword);

router.post('/changeprofile', changeprofile);

router.post('/changepassword', changepassword);

router.post('/checkpassword', checkpassword);

module.exports = router;