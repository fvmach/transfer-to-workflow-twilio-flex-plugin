require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const twilio = require('twilio');

const app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

// Logging setup
const BASE_LOG_DIR = path.join(__dirname, 'event-logs');
const EVENTS_DIR = path.join(BASE_LOG_DIR, 'events');
const ASSIGNMENTS_DIR = path.join(BASE_LOG_DIR, 'assignments');
[BASE_LOG_DIR, EVENTS_DIR, ASSIGNMENTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

app.locals.writeLog = (folderPath, content) => {
  const dateStr = new Date().toISOString().split('T')[0];
  const filePath = path.join(folderPath, `${dateStr}.log`);
  fs.appendFile(filePath, content + '\n', err => {
    if (err) console.error(`Error writing to ${filePath}:`, err);
  });
};

app.locals.twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Routes
app.use(require('./routes/ping'));
app.use(require('./routes/taskrouter-webhooks'));
app.use(require('./routes/assignment-callbacks'));
app.use(require('./routes/create-task'));

// Start
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
