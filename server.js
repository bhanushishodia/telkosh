require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sendLeadEmail } = require('./services/emailService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API to Submit Lead (Only send email)
app.post('/api/leads', async (req, res) => {
    try {
        const leadData = req.body;

        // Send email only
        await sendLeadEmail(leadData);

        res.json({ message: '✅ Email sent successfully', lead: leadData });
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        res.status(500).json({ error: 'Server error while sending email' });
    }
});

// Default Route
app.get("/", (req, res) => {
    res.send("🚀 Server is running - Email only mode!");
});

// Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`📬 Server running on port ${PORT}`));
