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
  const { name, email, phone, companyName, product, message, page } = leadData;
  // Check if the lead is from Malaysia Landing Page
  // const recipientEmail = page === "landingpage-malaysia" ? "prasun@telkosh.com" : "harpreet@mobishastra.com";
  const recipientEmail = "poonam@telkosh.com";  // Set this email for all leads
  console.log('Lead Page:', page);

  const mailOptions = {
    from: `"Lead Notification" <${process.env.SMTP_USER}>`,
    // to: 'harpreet@mobishastra.com',
    to: recipientEmail,
    bcc: "marketing@telkosh.com", // ✅ Multiple BCCs
    subject: `New Lead from ${page || 'Website'}`,
    html: `
      <h3>New Lead Received</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
       <p><strong>Company Name:</strong> ${companyName || 'N/A'}</p> <!-- Add company name here -->
      <p><strong>Product Interest:</strong> ${product || 'N/A'}</p>
      <p><strong>Message:</strong> ${message}</p>
      <p><strong>Source Page:</strong> ${page}</p>
    `
  };

  try {
    console.log(`📧 Sending email to: ${recipientEmail} with data:`, leadData);
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
    console.log("📬 Message ID:", info.messageId);
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
  }
};
const sendWelcomeEmail = async (leadData) => {
  const { name, email } = leadData;

  const mailOptions = {
    from: `"Telkosh Team" <${process.env.SMTP_USER}>`, // Same SMTP user
    to: email, // Lead ka apna email
    bcc: "Santosh@telkosh.com, marketing@telkosh.com, bhanu@anantya.ai", // <-- Multiple BCC emails
    subject: "Quick Acknowledgment - Telkosh Bulk SMS 🚀", // Subject line
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Hi ${name || 'there'},</h2>
        <p>We’re excited to hear from you! 🙌</p>
        <p>Your interest in <strong>Telkosh Bulk SMS</strong> is the first step to smarter, faster business messaging.</p>
        <p>We’ll get back to you shortly.</p>
         <p><strong>Need urgent help?</strong> Connect us anytime on <a href="https://wa.me/917297997408" target="_blank">+91-7297997408</a>.</p>

        <br/>
        <p>You're in good hands.</p>
        <ul style="list-style: none; padding-left: 0;">
          <li>🔒 Secure</li>
          <li>🌍 Global Reach</li>
          <li>💼 Trusted by Enterprises</li>
        </ul>
        <br/>
        <p>Warm Regards,<br/><strong>Telkosh Team</strong></p>
      </div>
    `
  };

  try {
    console.log(`📧 Sending welcome email to: ${email}`);
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Welcome email sent successfully");
    console.log("📬 Message ID:", info.messageId);
  } catch (err) {
    console.error("❌ Welcome email sending failed:", err.message);
  }
};

module.exports = { sendLeadEmail, sendWelcomeEmail };



