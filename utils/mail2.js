const nodemailer = require('nodemailer');
const pug = require('pug')


const sendEmail = async options => {
    //1) Create transporter

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }

        //Activate in Gmail "less secure app" options
    })
    //2) Define email options
    const mailOptions = {
        from: 'Cotton Fest <noreply@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    //3) Send the email
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;



// async function sendEmail(email, body, _subject) {
//     //configuring smtp transport machanism for password reset email
//     let transporter = nodemailer.createTransport({
//       service: "gmail",
//       port: 465,
//       secure: true, // true for 465, false for other ports
//       auth: {
//         user: process.env.EMAIL, // your gmail address
//         pass: process.env.EMAIL_PASSWORD // your gmail password
//       }
//     });
  
//     let mailOptions = {
//       subject: _subject,
//       to: email,
//       from: `Novelty Team`,
//       html: body
//     };
//     return transporter.sendMail(mailOptions);
//   }