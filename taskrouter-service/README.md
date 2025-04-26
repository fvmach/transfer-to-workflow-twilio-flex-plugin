# TaskRouter Service

A lightweight Node.js Express server for handling **Twilio TaskRouter** events, assignment callbacks, and dynamic task creation.

---

## Features

- Receives and logs **TaskRouter events** (e.g., `task.created`, `reservation.created`, `transfer.completed`).
- Receives and processes **Assignment Callback** webhooks.
- Adds new participants (Workers) to an ongoing **Conference** based on assignment.
- Provides an API endpoint for **creating new tasks** dynamically.
- Organizes server routes and logs by category.
- CORS-enabled for Flex (and external applications).

---

## Environment Variables (.env)

```bash
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WORKSPACE_SID=your_workspace_sid
TRANSFER_CALLER_ID=verified_twilio_number
PORT=3000
```

---

## Available Routes

| Route                  | Method | Description                              |
|------------------------|--------|------------------------------------------|
| `/ping`                | GET    | Health check endpoint                   |
| `/taskrouter-webhooks` | POST   | Receives TaskRouter event webhooks       |
| `/assignment-callbacks`| POST   | Handles Assignment Callback webhooks    |
| `/create-task`         | POST   | Creates a new TaskRouter task dynamically|

---

## Usage

Start the server:

```bash
npm install
node server.js 
```

---

## Notes

- TaskRouter Event logs are saved daily under `/logs/events/`
- Assignment Callback logs are saved under `/logs/assignments/`
- Server will automatically sanitize attributes when creating tasks (to avoid conflicts).
- Conference participant addition is handled safely during assignment callbacks.

---

## Future Enhancements

- Add optional Twilio signature validation.
- Implement retry logic on participant add.
- Support task updates and status callbacks if needed.