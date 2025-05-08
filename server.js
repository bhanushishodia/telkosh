require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { sendLeadEmail, sendWelcomeEmail } = require('./services/emailService');
const { sendWhatsAppMessage } = require('./services/whatsappService');
const { sendSMSMessage } = require('./services/smsService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ UptimeRobot Ping Route
app.get("/api/ping", (req, res) => {
    res.send("pong");
});

// ✅ API to Submit Lead (Test Mode: All services disabled)
app.post('/api/leads', async (req, res) => {
    try {
        const leadData = req.body;
        const { name, phone, email } = leadData;

        // ❌ Commented for testing
        // await sendLeadEmail(leadData);
        // await sendWelcomeEmail(leadData);
        // const parameters = [{ value: name }];
        // await sendWhatsAppMessage(name, phone, 'welcome1', parameters);
        // const smsMessage = `Hi ${name}, thanks for connecting with Us! Our team will contact you soon. –Team Telkosh`;
        // await sendSMSMessage(phone, smsMessage);

        // Send immediate response
        res.json({
            message: '✅ Form submitted successfully! Processing in the background.',
            lead: leadData
        });

        // Background tasks using setImmediate
        setImmediate(async () => {
            try {
                // Execute services asynchronously in background
                await sendLeadEmail(leadData);
                await sendWelcomeEmail(leadData);
                const parameters = [{ value: name }];
                await sendWhatsAppMessage(name, phone, 'welcome1', parameters);
                const smsMessage = `Hi ${name}, thanks for connecting with Us! Our team will contact you soon. –Team Telkosh`;
                await sendSMSMessage(phone, smsMessage);
                console.log('Background tasks completed!');
            } catch (error) {
                console.error('❌ Error in background task:', error.message);
            }
        });

    } catch (error) {
        console.error('❌ Error while processing lead:', error.message);
        res.status(500).json({ error: 'Server error while testing lead submission' });
    }
});

// ✅ Default Route
app.get("/", (req, res) => {
    res.send("🚀 Server is running - Test Mode (no services triggered)!");
});

// ✅ Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`📬 Server running on port ${PORT}`));
