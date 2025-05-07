const axios = require('axios');

const sendSMSMessage = async (mobileno, msgtext) => {
  if (!mobileno || !msgtext) {
    throw new Error('Missing required parameters: mobileno or msgtext.');
  }

  console.log("🔑 Sending SMS to:", mobileno);
  console.log("📝 SMS Content:", msgtext);

  const user = 'telkoshenq';
  const pwd = 'u1j_ubsm';

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
    const response = await axios.get(url, { timeout: 10000 }); // Set a timeout of 10 seconds
    console.log("✅ SMS Sent:", response.data);

    // Check for errors in the response
    if (response.data && response.data.includes('ERROR')) {
      console.error("❌ Error in SMS response:", response.data);
      throw new Error(`Error in SMS API response: ${response.data}`);
    }

    return response.data;
  } catch (error) {
    if (error.response) {
      // If API responds with error status
      console.error("❌ Error from API:", error.response.data);
      throw new Error(`Error from API: ${error.response.data}`);
    } else if (error.request) {
      // If no response was received
      console.error("❌ No response received:", error.request);
      throw new Error('No response received from SMS API');
    } else {
      // General error
      console.error("❌ Error sending SMS:", error.message);
      throw error;
    }
  }
};

module.exports = { sendSMSMessage };
