const express = require('express');
const { captureLead, getLeads } = require('../controllers/leadController');

const router = express.Router();

router.post('/capture', captureLead);
router.get('/', getLeads);

module.exports = router;
