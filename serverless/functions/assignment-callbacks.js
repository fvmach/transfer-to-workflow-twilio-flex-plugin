exports.handler = async function(context, event, callback) {
    const twilioClient = context.getTwilioClient();
    const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    console.log('Assignment Callback Received:', event.TaskSid);
  
    try {
      const taskAttributes = JSON.parse(event.TaskAttributes || '{}');
      const workerAttributes = JSON.parse(event.WorkerAttributes || '{}');
  
      const conferenceSid = taskAttributes.custom_transfer_conference_sid || taskAttributes.conference?.sid;
      const contactUri = workerAttributes.contact_uri;
  
      if (!conferenceSid || !contactUri) {
        console.error('Missing conferenceSid or contactUri. Skipping.');
        return callback(null, response);
      }
  
      await twilioClient.conferences(conferenceSid).participants.create({
        label: 'worker',
        from: context.TRANSFER_CALLER_ID,
        to: contactUri,
        earlyMedia: true,
        endConferenceOnExit: false,
      });
  
      console.log('Participant successfully added.');
    } catch (error) {
      console.error('Error during assignment callback processing:', error);
    }
  
    return callback(null, response);
  };
  