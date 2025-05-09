const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    companyName: { type: String, required: true }, // New field
    product: { type: String, required: false }, // New field
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', LeadSchema);
const mongoose = require('mongoose');


