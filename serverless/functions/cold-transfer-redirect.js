exports.handler = async function (context, event, callback) {
    const client = context.getTwilioClient();
  
    const customerCallSid = event.customerCallSid;
    const twimlUrl = event.twimlUrl;
  
    if (!customerCallSid || !twimlUrl) {
      return callback(null, {
        success: false,
        error: 'Missing customerCallSid or twimlUrl',
      });
    }
  
    try {
      await client.calls(customerCallSid)
        .update({
          url: 'https://handler.twilio.com/twiml/EHace33a8f87ed5d17731de9c67aa3d29b',
          method: 'POST'
        });
  
      return callback(null, { success: true });
    } catch (error) {
      console.error('Failed to redirect customer call:', error);
      return callback(null, { success: false, error: error.message });
    }
  };
  