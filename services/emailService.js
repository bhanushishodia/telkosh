const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('📦 Loading email service...');
console.log('🔐 SMTP_USER:', process.env.SMTP_USER);
console.log('📡 SMTP_SERVICE:', process.env.SMTP_SERVICE);

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Connection Error:', error.message);
  } else {
    console.log('✅ SMTP Server is ready to send emails');
  }
});

const sendLeadEmail = async (leadData) => {
  const { name, email, phone, companyName, product, message, page } = leadData;

  if (!name || !email) {
    console.error("❌ Missing required lead data: name or email");
    return { success: false, error: "Missing name or email" };
  }

  const recipientEmail = "poonam@telkosh.com";

  const mailOptions = {
    from: `"Lead Notification" <${process.env.SMTP_USER}>`,
    to: recipientEmail,
    bcc: "marketing@telkosh.com",
    subject: `New Lead from ${page || 'Website'}`,
    html: `
      <h3>New Lead Received</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Company Name:</strong> ${companyName || 'N/A'}</p>
      <p><strong>Product Interest:</strong> ${product || 'N/A'}</p>
      <p><strong>Message:</strong> ${message}</p>
      <p><strong>Source Page:</strong> ${page}</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Lead email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("❌ Email sending failed:", err.message);
    return { success: false, error: err.message };
  }
};

const sendWelcomeEmail = async (leadData) => {
  const { name, email, product } = leadData;

  const mailOptions = {
    from: `"Telkosh Team" <${process.env.SMTP_USER}>`,
    to: email,
    bcc: "Santosh@telkosh.com, marketing@telkosh.com, bhanu@anantya.ai",
    subject: "Quick Acknowledgment - Telkosh Bulk SMS 🚀",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Hi ${name || 'there'},</h2>
        <p>We’re excited to hear from you! 🙌</p>
        <p>Your interest in <strong>${product || 'our services'}</strong> is the first step to smarter, faster business messaging.</p>
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
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Welcome email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("❌ Welcome email failed:", err.message);
    return { success: false, error: err.message };
  }
};

module.exports = { sendLeadEmail, sendWelcomeEmail };
