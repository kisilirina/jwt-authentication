const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendActivationLinkToEmail = async (email, link) => {

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: `Активация аккаунта на ${process.env.API_URL}`,
    text: '',
    html:
      `<div>
          <h1>Для активации перейдите по ссылке</h1>
          <a href="${link}">${link}</a>
        </div>`,
  }
  await transporter.sendMail(mailOptions, (err, res) => err ? console.log(err) : console.log('Email sent'));
};

module.exports = {
  sendActivationLinkToEmail,
};
