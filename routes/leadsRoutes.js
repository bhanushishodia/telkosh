// routes/leadroutes.js

const express = require('express');
const { captureLead, getLeads } = require('../controllers/leadController');

const router = express.Router();

router.post('/capture', captureLead); // Email yahan se nahi bhejna chahiye, controller mein hoga
router.get('/', getLeads);

module.exports = router;
