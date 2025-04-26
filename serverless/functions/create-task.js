exports.handler = async function(context, event, callback) {
    const twilioClient = context.getTwilioClient();
    const response = new Twilio.Response();
    response.appendHeader('Access-Control-Allow-Origin', '*');
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST');
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    console.log('Create Task Request Received');
  
    try {
      const { taskChannel, workflowSid, attributes, timeout = 3600, priority = 0 } = event;
  
      if (!taskChannel || !workflowSid || !attributes) {
        console.error('Missing required parameters.');
        return callback(null, response);
      }
  
      const parsedAttributes = JSON.parse(attributes);
      const safeAttributes = { ...parsedAttributes };
  
      const conferenceMetadata = parsedAttributes.custom_transfer_metadata?.conference;
      if (conferenceMetadata) {
        safeAttributes.custom_transfer_conference_sid = conferenceMetadata.sid;
        safeAttributes.custom_transfer_original_worker_call_sid = conferenceMetadata.participants?.worker;
        safeAttributes.custom_transfer_original_customer_call_sid = conferenceMetadata.participants?.customer;
        delete safeAttributes.custom_transfer_metadata;
      }
  
      await twilioClient.taskrouter.v1
        .workspaces(context.TWILIO_WORKSPACE_SID)
        .tasks.create({
          taskChannel,
          workflowSid,
          attributes: JSON.stringify(safeAttributes),
          timeout,
          priority
        });
  
      console.log('Task created successfully.');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  
    return callback(null, response);
  };
  