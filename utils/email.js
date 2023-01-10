const nodemailer = require('nodemailer');

const sendMail = async (options) => {
  console.log('sendMail()');
  //CREATE TRANSPORTER
  
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //CREATE MAIL OPTIONS

  const mailOptions = {
    from: 'Aravind <arvind@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //SEND MAIL
  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
