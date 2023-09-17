const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: "smtp.strato.de",
    port: 465,
    auth: {
        user: "support@dormciety.de",
        pass: "Orangensaft.123"
    }
});

module.exports = transporter;
