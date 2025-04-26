import React from 'react';
import { FlexPlugin } from '@twilio/flex-plugin';
import { Actions } from '@twilio/flex-ui';
import WarmTransferButton from './components/WarmTransferButton';
import ColdTransferButton from './components/ColdTransferButton';

const PLUGIN_NAME = 'TransferToWorkflowPlugin';
const CREATE_TASK_URL = 'https://your-ngrok-domain/create-task'; // Update with your actual server URL (or serverless domain)
const TRANSFER_WORKFLOW_SID = 'WWxxxxxxxxxxxxxxx'; // Update with your Warm Transfer Workflow SID

export default class TransferToWorkflowPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  async init(flex, manager) {
    const customTransferHandler = async (payload, original) => {
      const { task, targetSid } = payload;

      // Only intercept if Voice task and target is a Queue
      if (task.taskChannelUniqueName !== 'voice' || !targetSid.startsWith('WQ')) {
        return original(payload);
      }

      console.log('Intercepting Voice transfer to Queue...');

      try {
        const affiliation = await fetchAffiliation(task);
        const conferenceSid = task.attributes.conference?.sid;

        if (!conferenceSid) {
          console.error('No conference SID found on task attributes. Cannot proceed.');
          return original(payload);
        }

        // Safely remove conference before sending new task
        const { conference, ...safeAttributes } = task.attributes;

        const updatedAttributes = {
          ...safeAttributes,
          affiliation: affiliation || safeAttributes.affiliation,
          selected_transfer_queue: targetSid,
          transfer_reason: 'Queue Transfer',
          custom_transfer_metadata: {
            conference,
          },
        };

        const createTaskResponse = await fetch(CREATE_TASK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            taskChannelSid: task.taskChannelSid,
            workflowSid: TRANSFER_WORKFLOW_SID,
            attributes: updatedAttributes,
            timeout: 3600,
            priority: 0,
          }),
        });

        if (!createTaskResponse.ok) {
          throw new Error(`Server responded with ${createTaskResponse.status}`);
        }

        console.log('New Voice transfer task created successfully.');
        return Promise.resolve(); // Prevent native transfer

      } catch (error) {
        console.error('Error during transfer interception:', error);
        return original(payload); // Fallback to native behavior if custom flow fails
      }
    };

    const fetchAffiliation = async (task) => {
      // TODO: Implement real affiliation retrieval if needed
      return task.attributes.affiliation || 'unknown';
    };

    Actions.replaceAction('TransferTask', customTransferHandler);

    // Add custom buttons to the Call Canvas

    // Warm Transfer Button
    flex.CallCanvasActions.Content.add(
      <WarmTransferButton key="studio-transfer-btn" />,
      { sortOrder: 10 }
    );

    // Cold Transfer Button
    flex.CallCanvasActions.Content.add(
      <ColdTransferButton key="cold-transfer-btn" />,
      { sortOrder: 11 }
    );
  }
}
