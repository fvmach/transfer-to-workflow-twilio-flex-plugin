# Twilio Functions - TaskRouter Service

This folder contains **four Twilio Functions** designed to mirror the API behavior of the `taskrouter-service` Express app.
Please do not rely on these functions for Production environment. These were not design for large scale deployments.
Just for testing.

## Functions Overview

### 1. `taskrouter-webhooks`
- **Purpose**: Capture and log TaskRouter events (e.g., `task.created`, `reservation.created`, etc.).
- **Method**: `POST`
- **CORS**: Enabled.

### 2. `assignment-callbacks`
- **Purpose**: Handle TaskRouter assignment callbacks.
- **Behavior**: Adds the newly assigned worker to an existing Twilio Voice Conference based on Task attributes.
- **Method**: `POST`
- **CORS**: Enabled.

### 3. `create-task`
- **Purpose**: Programmatically create a new TaskRouter Task for warm transfer scenarios.
- **Behavior**: Accepts sanitized task attributes and creates a new task in the specified Workflow.
- **Method**: `POST`
- **CORS**: Enabled.

### 4. `ping`
- **Purpose**: Simple health check endpoint.
- **Behavior**: Returns a `pong` response.
- **Method**: `GET`
- **CORS**: Enabled.

## Environment Variables

Each Function expects the following environment variables to be configured in the Twilio Console:

| Variable               | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `TWILIO_ACCOUNT_SID`    | Your Twilio Account SID                        |
| `TWILIO_AUTH_TOKEN`     | Your Twilio Auth Token                         |
| `TWILIO_WORKSPACE_SID`  | TaskRouter Workspace SID                      |
| `TRANSFER_CALLER_ID`    | Verified Twilio Phone Number for conference dialing |

## Deployment Notes

- These Functions can be deployed via the **Twilio Console** or **Twilio CLI**.
- Functions are fully **CORS-enabled** to allow browser-based (Flex) integrations.
- Each Function is **self-contained** and can be invoked independently.
- Make sure you deploy each Function under its own path matching its purpose (e.g., `/taskrouter-webhooks`, `/assignment-callbacks`, `/create-task`, `/ping`).
