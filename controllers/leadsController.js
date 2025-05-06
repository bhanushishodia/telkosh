const Lead = require('../models/Lead');
const { sendLeadEmail, sendWelcomeEmail } = require('../services/emailService');

exports.captureLead = async (req, res) => {
  try {
    const { name, email, phone, product, message, companyName, page } = req.body;

    // ✅ Validation
    if (!name || !email || !phone || !message || !companyName) {
      return res.status(400).json({
        success: false,
        message: 'Name, Email, Phone, Message, and Company Name are required'
      });
    }

    // ✅ Save to DB
    const lead = new Lead({ name, email, phone, product, message, companyName, page });
    await lead.save();

    // ✅ Respond FIRST (no waiting for email)
    res.status(201).json({
      success: true,
      message: 'Lead captured successfully!',
      orderId: `ANTCAM-${Date.now()}`,
      lead
    });

    // ✅ Background Email Send (fire-and-forget)
    sendLeadEmail({ name, email, phone, product, message, companyName, page }).catch(err =>
      console.error("❌ sendLeadEmail failed:", err.message)
    );
    sendWelcomeEmail({ name, email, product }).catch(err =>
      console.error("❌ sendWelcomeEmail failed:", err.message)
    );

    // ✅ Real-time socket event
    const io = req.app.get('socketio');
    if (io) {
      io.emit('newLead', lead);
    }

  } catch (err) {
    console.error('❌ Error capturing lead:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to capture lead',
      error: err.message
    });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json(leads);
  } catch (err) {
    console.error('❌ Error fetching leads:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leads',
      error: err.message
    });
  }
};
