const express = require('express');
const router = express.Router();
const chalk = require('chalk');
const path = require('path');

const INTERESTING_EVENTS = new Set([
  'task.created',
  'task.updated',
  'reservation.created',
  'transfer.initiated',
  'transfer.failed',
  'transfer.attempt.failed',
  'transfer.completed',
  'transfer.canceled',
  'task-queue.entered',
  'task-queue.target-workers-expression-updated',
  'workflow.entered',
  'workflow.target.matched'
]);

const EVENTS_DIR = path.join(__dirname, '..', 'event-logs', 'events');

router.post('/taskrouter-webhooks', (req, res) => {
  const event = req.body;
  console.log(chalk.blue.bold('TaskRouter Event:'), chalk.yellow(event.EventType));

  if (INTERESTING_EVENTS.has(event.EventType)) {
    const timestamp = new Date().toISOString();
    const shortLine = `${timestamp}  ${event.EventType.padEnd(35)}  Task:${event.TaskSid || ''}  Worker:${event.WorkerSid || ''}`;
    const fullEvent = `${timestamp}  [TaskRouter Event]\n${JSON.stringify(event, null, 2)}`;

    req.app.locals.writeLog(EVENTS_DIR, shortLine);
    req.app.locals.writeLog(EVENTS_DIR, fullEvent);
  }

  res.status(200).send('OK');
});

module.exports = router;
