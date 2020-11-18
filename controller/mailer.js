const nodemailer = require('nodemailer');
const config = require('../config/config');

const transport = nodemailer.createTransport({
    pool: true,
    service: 'Gmail',
    auth: {
        type: 'OAuth2',
        user: config.MAIL_USER,
        refreshToken: config.MAIL_REFRESHTOKEN,
        clientId: config.MAIL_CLIENTID,
        clientSecret: config.MAIL_CLIENTSECRET
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = {
    senEmail(from, to, subject, html) {
        return new Promise((resolve, reject) => {
            transport.sendMail({from, to, subject, html}, (err, info) => {
                if (err) reject(err);
                resolve(info);
            });
        })
    }
}