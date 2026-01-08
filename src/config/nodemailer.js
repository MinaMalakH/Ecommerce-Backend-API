const nodemailer = require("nodemailer");

exports.createTransporter = async () => {
  // Development: Use Ethereal (Fake SMTP)
  if (process.env.NODE_ENV === "development") {
    // Create test account
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
  // Production: Use real Gmail
  return nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};
