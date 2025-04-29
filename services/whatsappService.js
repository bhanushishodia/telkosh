const fetch = require('node-fetch');
const FormData = require('form-data');

console.log('📦 Loading whatsapp service...');

const sendWhatsAppMessage = async (recipientName, recipientNumber, templateName = "Default_Template", parameters = []) => {

  const apiUrl = 'https://apiv1.anantya.ai/api/Campaign/SendSingleTemplateMessage?templateId=4'; 
  const apiKey = '4051519F-5C48-4C17-A4CB-24A10A4FC0FD';

  console.log('Step 1: Preparing to send WhatsApp message.');
  console.log('Recipient Number:', recipientNumber);
  console.log('Recipient Name:', recipientName); // Logging recipient name
  console.log('Template Name:', templateName);
  console.log('Parameters:', parameters);

  try {
    console.log('Step 2: Sending POST request to API.');

    let dataVal = new FormData();
    dataVal.append('ContactName', recipientName);
    dataVal.append('ContactNo', recipientNumber);
    dataVal.append('Attribute1', recipientName); 

    // Add parameters dynamically
    parameters.forEach((param, index) => {
      dataVal.append(`Param${index + 1}`, param.value);
    });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        "accept": "*/*",
        "X-Api-Key": apiKey,
      },
      body: dataVal,
    });

    console.log('Step 3: Received API response.');
    console.log('Response Status:', response.status);

    const data = await response.json();  // Always parse JSON response

    if (!response.ok) {
      console.log('Step 4: API returned an error.');
      console.log('API Error Details:', data);
      throw new Error(`API Error: ${JSON.stringify(data)}`);
    }

    console.log('Step 5: Message sent successfully:', data);
    console.log("✅ Full API response: ", JSON.stringify(data, null, 2));

    return data;
  } catch (error) {
    console.error('Step 6: Error occurred in sendWhatsAppMessage function.');
    console.error('Error Details:', error.message || error);
    throw error;
  }
};
module.exports = { sendWhatsAppMessage };
