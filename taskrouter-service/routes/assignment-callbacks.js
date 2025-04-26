const express = require('express');
const router = express.Router();
const chalk = require('chalk');
const path = require('path');

const ASSIGNMENTS_DIR = path.join(__dirname, '..', 'event-logs', 'assignments');

router.post('/assignment-callbacks', async (req, res) => {
  const assignment = req.body;

  console.log('\n' + chalk.magenta.bold('=== Assignment Callback Received ==='), chalk.yellow(assignment.TaskSid || '(no TaskSid)'));
  console.dir(assignment, { depth: null, colors: true });

  const timestamp = new Date().toISOString();
  const fullAssignment = `${timestamp}  [Assignment Callback]\n${JSON.stringify(assignment, null, 2)}`;
  req.app.locals.writeLog(ASSIGNMENTS_DIR, fullAssignment);

  let conferenceSid, contactUri;
  try {
    const taskAttrs = JSON.parse(assignment.TaskAttributes || '{}');
    const workerAttrs = JSON.parse(assignment.WorkerAttributes || '{}');
    conferenceSid = taskAttrs.custom_transfer_conference_sid || taskAttrs.conference?.sid;
    contactUri = workerAttrs.contact_uri;
  } catch (error) {
    console.error('Failed to parse TaskAttributes or WorkerAttributes:', error);
  }

  if (!conferenceSid || !contactUri) {
    console.error('Missing conferenceSid or contactUri, skipping participant add.');
    return res.status(200).json({ instruction: 'accept' });
  }

  try {
    await client.conferences(conferenceSid)
    .participants
    .create({
      label: 'worker',
      from: process.env.TRANSFER_CALLER_ID,
      to: contactUri,
      earlyMedia: true,
      endConferenceOnExit: false,
      muted: false,     // ✨ New: Agent joins unmuted
      hold: false       // ✨ New: Agent is active immediately
    });
  
    console.log('Participant successfully added.');
    return res.status(200).json({ instruction: 'accept' });

  } catch (error) {
    console.error('Error adding participant:', error);
    return res.status(200).json({ instruction: 'accept' });
  }
});

module.exports = router;
