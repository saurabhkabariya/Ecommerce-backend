import http from 'http';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.Email,
        pass: process.env.EMAIL_PASS,
    },
})

async function sendEmail(to, subject, text, html){
    try{
        const info= await transporter.sendMail({
            from: process.env.Email,
            to,
            subject,
            text,
            html,
        });
        return {success: true, messageid: info.messageId};
    }
    catch(err){
        console.log(err);
        return {success: false, error: err.message};
    }
}

export{
    sendEmail,
};