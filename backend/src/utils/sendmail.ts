import nodemailer from 'nodemailer';
import path from 'path';
import hbs from 'nodemailer-express-handlebars';
import dotenv from 'dotenv';

export async function Decrypt(values) {
    try {
        // const decData = CryptoJS.enc.Base64.parse(values == null ? '' : values)?.toString(CryptoJS.enc.Utf8)
        // const bytes = CryptoJS.AES.decrypt(decData, process.env.cryptoSecret).toString(CryptoJS.enc.Utf8)

        // return JSON.parse(bytes)

        return decodeURIComponent(escape(atob(values)));
    } catch (err) {
        console.log("error while decrypt userPassword for mail", err.message);
    }
}

const sendmail = async (mailOptions: any) => {
    try {
        let userId = process.env.USER_ID;
        let password = process.env.PASSWORD;

        let transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: userId,
                pass: password
            }
        });
        // let transport = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: userId,
        //         pass: password
        //     }
        // })


        const handlebarOptions = {
            viewEngine: {
                partialsDir: path.resolve('./src/templates/'),
                defaultLayout: false,
            },
            viewPath: path.resolve('./src/templates/'),
        };

        transport.use('compile', hbs(handlebarOptions));

        mailOptions.from = userId;

        await transport.sendMail(mailOptions, function (error: any, info: any) {
            if (error) {
                console.log('Email error: ', error);
            }
            else {
                console.log('Email sent: ', info.response);
            }
        })
    } catch (error) {
        console.error('Error sending email:', error);
        // res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
}

export {
    sendmail
}