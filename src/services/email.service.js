const nodemailer = require("nodemailer");
const { createTransporter } = require("../config/nodemailer");
const {
  registerVerificationEmailTemplate,
} = require("../utils/emailsTemplates");

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = await createTransporter();
    const mailOptions = {
      from: {
        name: "E-commerce App",
        address: process.env.EMAIL_USER,
      },
      to,
      subject,
      html,
    };
    const info = await transporter.sendMail(mailOptions);
    // Log preview URL in development
    if (process.env.NODE_ENV === "development") {
      console.log("📧 Email sent successfully!");
      console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
    } else {
      console.log("📧 Email sent to:", to);
    }

    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

const sendVerificationEmail = async (email, verificationToken, userName) => {
  const html = registerVerificationEmailTemplate(userName, verificationToken);
  const subject = "Verify Your Email Address";
  await sendEmail(email, subject, html);
};

module.exports = { sendEmail, sendVerificationEmail };
