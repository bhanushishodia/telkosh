// services/emailService.js

const nodemailer = require('nodemailer');
require('dotenv').config(); // Load env variables

// Create transporter using env values
const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE || 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Send email function
const sendLeadEmail = async (leadData) => {
  const { name, email, phone, website, product, message, page } = leadData;

  const mailOptions = {
    from: `"Lead Notification" <${process.env.SMTP_USER}>`,
    to: 'receiver-email@example.com', // 🟢 Hardcoded receiver email here
    subject: `New Lead from ${page || 'Website'}`,
    html: `
      <h3>New Lead Received</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Website:</strong> ${website || 'N/A'}</p>
      <p><strong>Product Interest:</strong> ${product || 'N/A'}</p>
      <p><strong>Message:</strong> ${message}</p>
      <p><strong>Source Page:</strong> ${page}</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendLeadEmail };
