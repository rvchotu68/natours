const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const path = require('path');

module.exports = class Email {
  constructor(user, url) {
    (this.firstName = user.name.split(' ')[0]),
      (this.url = url),
      (this.to = user.email),
      (this.from = `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`);
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USER,
          pass: process.env.SENDGRID_PASS,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    //render a html page to send to the client
    const html = pug.renderFile(
      path.join(__dirname, `../views/email/${template}.pug`),
      {
        name: this.firstName,
        url: this.url,
        subject,
      }
    );
    //set mail options

    const mailOptions = {
      from: 'arvind.arvindkumar6863@gmail.com',
      to: this.to,
      subject,
      html,
      text: htmlToText.htmlToText(html),
    };

    //get the transport and send the mail
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to natours family');
  }

  async sendPasswordResetLink() {
    await this.send(
      'passwordReset',
      'Natours password reset link (valid for 10 mins) '
    );
  }
};

// const sendMail = async (options) => {
//   //CREATE MAIL OPTIONS

//   const mailOptions = {
//     from: 'Aravind <arvind@gmail.com>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//   };

//   //SEND MAIL
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendMail;
