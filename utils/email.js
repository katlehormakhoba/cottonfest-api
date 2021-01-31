const nodemailer = require('nodemailer');
const pug = require('pug')


// const sendEmail = async options => {
//     //1) Create transporter

//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: process.env.EMAIL_USERNAME,
//             pass: process.env.EMAIL_PASSWORD
//         }

//         //Activate in Gmail "less secure app" options
//     })
//     //2) Define email options
//     const mailOptions = {
//         from: 'Cotton Fest <noreply@gmail.com>',
//         to: options.email,
//         subject: options.subject,
//         text: options.message
//     }
//     //3) Send the email
//     await transporter.sendMail(mailOptions);
// }

class sendEmail {

    mailOptions = {
        from: 'Cotton Fest <noreply@gmail.com>',
        to: '',
        subject: '',
        html: '',
        text: ''
    }

    constructor(user, url) {
        this.mailOptions.to = user.email;
        this.name = user.name.split(' ')[0];
        this.url = url;
    }

    createTransport() {
        return nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }

            //Activate in Gmail "less secure app" options
        })
    }

    async send(template, subject){
        //1) render html based on pug template
        const html = pug.renderFile(`${__dirname}/../public/views/${template}.pug`, {
            name: this.name,
            url: this.url,
            subject
        });

        this.mailOptions.subject = subject;
        this.mailOptions.html = html;

        await this.createTransport().sendMail(this.mailOptions);

    }


    async sendWelcome(){
        await this.send('welcome', 'Welcome to the Cotton Fest Family!');
    }
    async sendReset(){
        await this.send('passwordReset', 'Password reset token (valid for 10 min)');
    }
}
module.exports = sendEmail;