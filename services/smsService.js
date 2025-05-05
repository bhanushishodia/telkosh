const axios = require('axios');

const sendSMSMessage = async (mobileno, msgtext) => {
  console.log("🔑 Sending SMS to:", mobileno);
  console.log("📝 SMS Content:", msgtext);

  const user = '20083935';
  const pwd = 'neeraj';

  // Detect country from mobile number
  let senderid = 'MOALRT';
  let countryCode = '91'; // Default to India

  if (mobileno.startsWith('+973')) {
    senderid = 'Mobishtra'; // Bahrain sender ID
    countryCode = '973';
  } else if (mobileno.startsWith('+60')) {
    senderid = 'Mobishtra'; // Malaysia sender ID
    countryCode = '60';
  } else if (mobileno.startsWith('+91')) {
    senderid = 'MOALRT'; // India sender ID
    countryCode = '91';
  }

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
