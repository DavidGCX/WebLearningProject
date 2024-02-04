const nodemailer = require('nodemailer');

const sendEmail = async (options) => { 
    var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
        }
    
    })
    const mailOptions = {
        from: "WebEmailTest <someTest@test.test>",
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transport.sendMail(mailOptions); 
}

module.exports = sendEmail;