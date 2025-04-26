exports.handler = async function (context, event, callback) {
    const client = context.getTwilioClient();
  
    const conferenceSid = event.conferenceSid;
    const to = event.to; // Destination number (should route to Studio)
    const from = event.from || context.DEFAULT_CALLER_ID;
  
    if (!conferenceSid || !to) {
      return callback(null, {
        success: false,
        error: "Missing required parameters: conferenceSid and to",
      });
    }
  
    try {
      const participant = await client.conferences(conferenceSid)
        .participants
        .create({
          to,
          from,
          earlyMedia: true,
          beep: 'onEnter',
          label: 'studio-transfer'
        });
  
      return callback(null, {
        success: true,
        participantSid: participant.callSid
      });
    } catch (error) {
      console.error("Failed to add participant to conference", error);
      return callback(null, {
        success: false,
        error: error.message
      });
    }
  };
  