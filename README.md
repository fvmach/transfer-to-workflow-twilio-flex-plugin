# Transfer to Workflow Plugin for Twilio Flex

## Overview

The **Transfer to Workflow Plugin** enhances Flex by allowing agents to transfer a live call not just to a Worker or a Queue, but to an entire **Workflow**, enabling dynamic routing based on task attributes.

This enables more flexible transfer flows, where the new task is evaluated dynamically against Workflow conditions (skills, attributes, etc.) instead of being statically assigned.

---

## Transfer Approaches

### 1. TransferTask Action Interception (**Preferred Approach**)
- Intercepts the native Flex "Transfer Task" action.
- Cancels the native Queue transfer.
- Creates a **new Task** with customized attributes.
- Triggers a Workflow evaluation for dynamic routing.
- Keeps the conference open and manages the transfer cleanly.

> This method is the most powerful and cleanly integrated into Flex.

### 2. Studio-Based Transfer
- Optionally, you can initiate the transfer by **sending the call back to Twilio Studio**.
- Studio can then create a new Task.
- However, this can introduce additional leg complexity, delays, and conference overhead.

> We strongly recommend using the TransferTask interception approach unless Studio-based orchestration is absolutely necessary.

---

## Why Not Transfer Directly to a Queue or Worker?

By transferring to a **Workflow**, you:
- Allow TaskRouter to dynamically evaluate routing conditions.
- Enable transfers based on real-time attributes like `affiliation`, `language`, `priority`, etc.
- Allow fallback and escalation logic through Workflow Filters.

Instead of deciding at transfer time where the task should go statically, you let the Workflow decide dynamically.

---

## Folder Structure

```
Transfer_to_Workflow_Plugin/
├── transfer-to-workflow/       # Flex Plugin code (src, components, actions)
├── taskrouter-service/         # Express service for task creation and event handling (optional)
├── taskrouter-functions/       # Twilio Functions alternative for serverless deployment
└── serverless/                 # Reserved for Twilio Serverless app deployment (optional)
```

---

## Environment Variables (Flex Plugin)
- `REACT_APP_CREATE_TASK_URL`: The endpoint to create the new Task.
- `REACT_APP_TRANSFER_WORKFLOW_SID`: The SID of the Workflow to evaluate new tasks against.

## Environment Variables (Server / Functions)
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WORKSPACE_SID`
- `TRANSFER_CALLER_ID`

---

## Deployment Options

- **Local Testing**: Run the Express server (`taskrouter-service`) and Flex Plugin locally.
- **Twilio Functions**: Deploy Functions (`taskrouter-functions`) directly in Twilio Console for easy serverless testing.
- **Production**: Prefer deploying a production server for maximum performance and control.
