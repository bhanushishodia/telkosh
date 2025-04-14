// services/emailService.js

const nodemailer = require('nodemailer');
require('dotenv').config(); // Load env variables

console.log('📦 Loading email service...');
console.log('🔐 SMTP_USER:', process.env.SMTP_USER);
console.log('📡 SMTP_SERVICE:', process.env.SMTP_SERVICE);

// Create transporter using env values
const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
// Optional: Verify connection when server starts
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Connection Error:', error.message);
  } else {
    console.log('✅ SMTP Server is ready to send emails');
  }
});

// Send email function
const sendLeadEmail = async (leadData) => {
  const { name, email, phone, website, product, message, page } = leadData;

  const mailOptions = {
    from: `"Lead Notification" <${process.env.SMTP_USER}>`,
    to: 'harpreet@mobishastra.com',
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

  try {
    console.log("📧 Sending email with data:", leadData);
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
    console.log("📬 Message ID:", info.messageId);
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
  }
};

module.exports = { sendLeadEmail };
