const axios = require('axios');

const sendSMSMessage = async (mobileno, msgtext) => {
  console.log("🔑 Sending SMS to:", mobileno);  // Log the phone number
  console.log("📝 SMS Content:", msgtext);    // Log the message content
  const user = '20083935';
  const pwd = 'neeraj';
  const senderid = 'MOALRT';
  const countryCode = 'All';

  const url = `http://mshastra.com/sendurl.aspx?user=${encodeURIComponent(user)}&pwd=${encodeURIComponent(pwd)}&senderid=${encodeURIComponent(senderid)}&mobileno=${encodeURIComponent(mobileno)}&msgtext=${encodeURIComponent(msgtext)}&CountryCode=${encodeURIComponent(countryCode)}`;

  try {
    const response = await axios.get(url);
    console.log("✅ SMS Sent:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error sending SMS:", error.message);
    throw error;
  }
};

module.exports = { sendSMSMessage };
