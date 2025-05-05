const axios = require('axios');

const sendSMSMessage = async (mobileno, msgtext) => {
  console.log("🔑 Sending SMS to:", mobileno);
  console.log("📝 SMS Content:", msgtext);

  const user = '20083935';
  const pwd = 'neeraj';

  // Set senderid based on country
  let senderid = 'MOALRT'; // Default sender ID

  if (mobileno.startsWith('+973')) {
    senderid = 'Mobishtra'; // Bahrain
  } else if (mobileno.startsWith('+60')) {
    senderid = 'Mobishtra'; // Malaysia
  } else if (mobileno.startsWith('+91')) {
    senderid = 'MOALRT'; // India
  }

  // Always use "All" for CountryCode as per instruction
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
