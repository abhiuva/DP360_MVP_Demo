const {CONFIG} = require("./index")
const nodemailer = require("nodemailer")

exports.mailTransport = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: CONFIG.SMTP_HOST,
            port: CONFIG.SMTP_PORT,
            // secure: true, // use true, for https emails and 465 port
            auth: {
                user: CONFIG.SMTP_EMAIL,
                pass: CONFIG.SMTP_PASSWORD,
            },
        })
        
        console.log("sending email")
        await transporter.sendMail({
            from: CONFIG.SMTP_EMAIL,
            to: CONFIG.SMTP_TO,
            subject: options.subject,
            html: options.html,
        });
    } catch (error) {
        throw error;
    }
}