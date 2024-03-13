const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemailerConfig");

const sendEmail = async ({ to, subject, html }) => {
  console.log("Send Email");
  console.log(to);
  console.log(subject);
  console.log(html);
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport(nodemailerConfig);

  return transporter.sendMail({
    from: '"Mahakumbh" <noreply.mahakumbh@gmail.com>', // sender address
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
