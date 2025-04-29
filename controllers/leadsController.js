const Lead = require('../models/Lead');
const { sendLeadEmail } = require('../services/emailService');

exports.captureLead = async (req, res) => { 
    try {
       
        const { name, email, phone, product, message, companyName } = req.body;

        // Check if required fields are provided
        if (!name || !email || !phone || !message || !companyName) {
            return res.status(400).json({ success: false, message: 'Name, Email, Phone, Message, and Company Name are required' });
        }
        

        const lead = new Lead({ name, email, phone, product, message, companyName });
        await lead.save();

        // ✅ Send email after saving lead
        await sendLeadEmail({ name, email, phone, product, message, companyName });

        // Emit real-time data if socket.io is available
        const io = req.app.get('socketio');
        if (io) {
            io.emit('newLead', lead);
        }

        res.status(201).json({ success: true, message: 'Lead captured successfully and email sent!', lead });
    } catch (err) {
        console.error('Error capturing lead:', err);
        res.status(500).json({ success: false, message: 'Failed to capture lead', error: err.message });
    }
};

exports.getLeads = async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.status(200).json(leads);
    } catch (err) {
        console.error('Error fetching leads:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch leads', error: err.message });
    }
};
