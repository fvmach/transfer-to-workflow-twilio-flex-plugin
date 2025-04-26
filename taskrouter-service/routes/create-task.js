const express = require('express');
const router = express.Router();
const chalk = require('chalk');

router.post('/create-task', async (req, res) => {
  const { taskChannel, workflowSid, attributes, timeout = 3600, priority = 0 } = req.body;

  console.log('\n' + chalk.cyan.bold('=== Create Task Request Received ==='));
  console.dir(req.body, { depth: null, colors: true });

  if (!taskChannel || !workflowSid || !attributes) {
    console.error('Missing required parameters to create task.');
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  try {
    const client = req.app.locals.twilioClient;

    const rawAttributes = attributes;
    const safeAttributes = { ...rawAttributes };

    const conferenceMetadata = rawAttributes.custom_transfer_metadata?.conference;
    if (conferenceMetadata) {
      safeAttributes.custom_transfer_conference_sid = conferenceMetadata.sid;
      safeAttributes.custom_transfer_original_worker_call_sid = conferenceMetadata.participants?.worker;
      safeAttributes.custom_transfer_original_customer_call_sid = conferenceMetadata.participants?.customer;
      delete safeAttributes.custom_transfer_metadata;
    }

    const task = await client.taskrouter.v1
      .workspaces(process.env.TWILIO_WORKSPACE_SID)
      .tasks
      .create({
        taskChannel,
        workflowSid,
        attributes: JSON.stringify(safeAttributes),
        timeout,
        priority
      });

    console.log('Task successfully created:', task.sid);
    return res.status(200).json({ success: true, taskSid: task.sid });

  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ error: 'Failed to create task.' });
  }
});

module.exports = router;
