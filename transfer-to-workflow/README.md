# Transfer to Workflow Plugin for Twilio Flex

This Flex Plugin provides two approaches to enable **dynamic transfer of Voice Tasks** through **Workflow re-evaluation**, instead of directly transferring to a Worker or Queue.

The goal is to **route the new transfer task dynamically** using a **TaskRouter Workflow** based on **updated task attributes** (e.g., `affiliation`, `selected_transfer_queue`, `priority`, etc.), allowing more flexible and intelligent agent transfers.

---

## Why Transfer to Workflow?

Unlike native Flex transfer, where you transfer directly to a specific Worker or Queue, **this plugin creates a new task**, sends it back through the configured **Workflow**, and **lets TaskRouter dynamically find the best agent** based on the latest task attributes.

This enables:
- Dynamic skill-based routing at the moment of transfer.
- Multi-BPO and multi-team dynamic transfers.
- Better segmentation and reporting across transfer flows.

---

## Transfer Approaches

### 1. **TransferTask Action Interception (Preferred Approach)**

**Flow:**
- The plugin intercepts the native `TransferTask` Action.
- When an agent selects a Queue as the transfer target, **instead of natively transferring**, the plugin:
  - Updates or enriches task attributes (e.g., setting `affiliation`).
  - Creates a **new Voice Task** programmatically using Twilio Functions or Serverless.
  - Assigns the new task to the transfer Workflow.
  - The Workflow uses updated attributes to route the task to the appropriate agent.

**Benefits:**
- Native Flex user experience remains unchanged.
- Minimal Studio dependency.
- No additional configuration in Studio beyond initial call setup.
- More flexible, programmable control over transfers.

**Requirements:**
- The `transfer-to-workflow` plugin installed and active in Flex.
- Supporting backend services (e.g., `/create-task`, `/assignment-callbacks`) either via Express app or Twilio Functions.

---

### 2. **Studio-Based Transfer Approach**

**Flow:**
- Upon transfer, the agent uses a Studio Flow to trigger transfer.
- Studio:
  - Receives task attributes and transfer parameters.
  - Creates a **new Task** using Run Function / HTTP Request Widget.
  - Re-enters the Workflow for dynamic re-assignment.

**Benefits:**
- No Plugin installation needed.
- Full control through Studio logic.

**Drawbacks:**
- Slightly slower (extra Studio hop).
- More complex error handling required in Studio.
- Less native-feeling for Flex agents compared to action interception.

**When to Use:**
- When plugin installation is not possible.
- When transfers must be coordinated across multiple complex workflows inside Studio.

---

## Project Structure

- `TransferToWorkflowPlugin.js` — Main Plugin logic for intercepting TransferTask Action.
- `components/ColdTransferButton.js` — UI Button for cold transfers (for testing).
- `components/WarmTransferButton.js` — UI Button for warm transfers (for testing).
- `functions/` — Supporting Functions (optional) to create tasks and manage conference participants.

---

## Prerequisites

- Twilio Flex UI 2.x
- Flex Plugin Builder 5.x
- TaskRouter Workspace and Workflows configured for transfer routing.
- Supporting Twilio Functions (or server-side Express app) for:
  - Creating new Voice Tasks (`create-task`)
  - Handling Assignment Callbacks (`assignment-callbacks`)

---

## Next Steps

Later, we will add:
- Example TaskRouter **Workflows** for transfer routing (based on `affiliation`, `selected_transfer_queue`, etc.).
- Example **Studio Flows** for fallback Studio-based transfer.
- Flex UI Enhancements (e.g., custom transfer UI improvements).