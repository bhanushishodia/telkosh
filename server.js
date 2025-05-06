require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sendLeadEmail, sendWelcomeEmail } = require('./services/emailService');
const { sendWhatsAppMessage } = require('./services/whatsappService'); // Import the function
const { sendSMSMessage } = require('./services/smsService'); // ✅ Import SMS service
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
// ✅ UptimeRobot Ping Route
app.get("/api/ping", (req, res) => {
    res.send("pong");
});
// API to Submit Lead (Only send email)
app.post('/api/leads', async (req, res) => {
    try {
        const leadData = req.body;
        const { name, phone, email } = leadData;  // Destructure name, phone, and email from leadData
        // Send email only
        await sendLeadEmail(leadData);
        // Send welcome email to the lead
        await sendWelcomeEmail(leadData);
        // Send WhatsApp welcome message
        // Corrected parameter array for template with only one placeholder
        const parameters = [
            { value: name }
        ];

        // Trigger the WhatsApp message
        await sendWhatsAppMessage(name, phone, 'welcome1', parameters);  // Use the correct template name
 // ✅ Send Welcome SMS to lead
 const smsMessage = `Hi ${name}, thanks for connecting with Us! Our team will contact you soon. For queries, feel free to reply. –Team Telkosh`;
 await sendSMSMessage(phone, smsMessage);
        res.json({ message: '✅   Both Email and WhatsApp message sent successfully', lead: leadData });
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        res.status(500).json({ error: 'Server error while sending email' });
    }
});

// Default Route
app.get("/", (req, res) => {
    res.send("🚀 Server is running - Email and WhatsApp & SMS mode!");
});

// Start Server
// const PORT = process.env.PORT || 10000;
// app.listen(PORT, () => console.log(`📬 Server running on port ${PORT}`));
// Start Server
const PORT = process.env.PORT || 80; // Port 80 set kiya gaya hai
app.listen(PORT, () => console.log(`📬 Server running on port ${PORT}`));
