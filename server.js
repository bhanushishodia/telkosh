require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1); // Stop server if DB fails to connect
    });

// Lead Schema
const LeadSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    company: String,  
    product: String,   
    website: String,   
    message: String,
    page: String, // Added to differentiate lead sources
    createdAt: { type: Date, default: Date.now }
});

const Lead = mongoose.model('Lead', LeadSchema);

// API to Submit Lead
app.post('/api/leads', async (req, res) => {
    try {
        const newLead = new Lead(req.body);
        await newLead.save();

        // Emit new lead to frontend
        io.emit('newLead', newLead);

        res.json({ message: 'Lead submitted successfully', lead: newLead });
    } catch (error) {
        console.error('❌ Error saving lead:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// API to Fetch All Leads
app.get('/api/leads', async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        console.error('❌ Error fetching leads:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// API to Fetch Home Page Leads
app.get('/api/leads/home', async (req, res) => {
    try {
        const homeLeads = await Lead.find({ page: 'home' }).sort({ createdAt: -1 });
        res.json(homeLeads);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// API to Fetch Contact Page Leads
app.get('/api/leads/contact', async (req, res) => {
    try {
        const contactLeads = await Lead.find({ page: 'contact' }).sort({ createdAt: -1 });
        res.json(contactLeads);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// API to Fetch landing Page Leads
app.get('/api/leads/landing', async (req, res) => {
    try {
        const contactLeads = await Lead.find({ page: 'landingpagekenya' }).sort({ createdAt: -1 });
        res.json(contactLeads);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// API to Fetch country Page Leads
app.get('/api/leads/country', async (req, res) => {
    try {
        const contactLeads = await Lead.find({ page: 'countrypageForm' }).sort({ createdAt: -1 });
        res.json(contactLeads);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Default Route
app.get("/", (req, res) => {
    res.send("Server is running successfully!");
});

// Socket.IO Connection
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
});

// Start Server
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));