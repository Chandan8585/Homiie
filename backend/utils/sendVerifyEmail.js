const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
const sendVerificationEmail = (email, userId) => {
  const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  const verificationUrl = `${process.env.BASE_URL}/verify?token=${token}`;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: process.env.GMAIL_USER, 
      pass: process.env.GMAIL_PASS, 
    },
  });

  // Email content
  const mailOptions = {
    from: process.env.GMAIL_USER, // Sender email address
    to: email, // Receiver email
    subject: "Verify Your Email", // Subject line
    html: `
      <h1>Welcome!</h1>
      <p>Click the button below to verify your email:</p>
      <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Click here to Verify</a>
      <p>If the button above doesn't work, copy and paste this URL into your browser:</p>
      <p>${verificationUrl}</p>
    `, // Email HTML body
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      throw error;
    }
    console.log("Email sent:", info.response);
  });
};

module.exports = sendVerificationEmail;
