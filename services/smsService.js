const axios = require('axios');

const sendSMSMessage = async (mobileno, msgtext) => {
  if (!mobileno || !msgtext) {
    throw new Error('Missing required parameters: mobileno or msgtext.');
  }

  console.log("🔑 Sending SMS to:", mobileno);
  console.log("📝 SMS Content:", msgtext);

  const user = 'telkoshenq';
  const pwd = 'u1j_ubsm';

  // Determine sender ID based on mobile number prefix
  let senderid = 'MOALRT'; // Default for India

  if (mobileno.startsWith('+973') || mobileno.startsWith('+60')) {
    senderid = 'Mobishtra'; // Bahrain & Malaysia
  }

  const countryCode = 'All';

  const url = `http://mshastra.com/sendurl.aspx?user=${encodeURIComponent(user)}&pwd=${encodeURIComponent(pwd)}&senderid=${encodeURIComponent(senderid)}&mobileno=${encodeURIComponent(mobileno)}&msgtext=${encodeURIComponent(msgtext)}&CountryCode=${encodeURIComponent(countryCode)}`;

  try {
    const response = await axios.get(url, { timeout: 10000 });

    if (!response || response.status !== 200) {
      throw new Error("SMS API did not respond properly");
    }

    console.log("✅ SMS Sent:", response.data);

    if (typeof response.data === 'string' && response.data.toLowerCase().includes('error')) {
      console.error("❌ Error in SMS response:", response.data);
      throw new Error(`SMS API responded with an error: ${response.data}`);
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("❌ SMS API Error:", error.response.data);
      // throw new Error(`SMS API Error: ${error.response.data}`);
    } else if (error.request) {
      console.error("❌ No response received from SMS API");
      // throw new Error('No response received from SMS API');
    } else {
      console.error("❌ General Error sending SMS:", error.message);
      // throw error;
    }
  
    // Optionally return null or custom safe response
    return null;
  }
  
};

module.exports = { sendSMSMessage };
