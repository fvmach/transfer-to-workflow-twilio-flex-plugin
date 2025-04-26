import React, { useState } from 'react';
import { Actions, TaskHelper, withTaskContext } from '@twilio/flex-ui';
import { Button } from '@twilio-paste/core/button';
import { useToaster } from '@twilio-paste/core/toast';

const WarmTransferButton = ({ task }) => {
  const [isTransferring, setIsTransferring] = useState(false);
  const toaster = useToaster();

  const handleWarmTransfer = async () => {
    setIsTransferring(true);
    try {
      const customerCallSid = task.attributes?.conference?.participants?.customer;
      const conferenceSid = task.attributes?.conference?.sid;
  
      if (!conferenceSid || !customerCallSid) {
        console.error('Conference or customer participant missing.', task.attributes);
        toaster.push({
          message: 'Conference info missing. Cannot transfer.',
          variant: 'error',
        });
        setIsTransferring(false);
        return;
      }
  
      await Actions.invokeAction('HoldCall', {
        sid: task.sid,
        participantCallSid: customerCallSid,
      });
  
      // Instead of Flex warm transfer action, call our serverless function
      const response = await fetch('https://transfer-to-workflow-4057.twil.io/add-participant-to-conference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          conferenceSid,
          to: '+551150397615',
          from: '+551150397615',
        }),
      });
  
      const result = await response.json();
  
      if (!result.success) {
        throw new Error(result.error);
      }
  
      toaster.push({
        message: 'Warm Transfer initiated. Participant added to conference.',
        variant: 'success',
      });
    } catch (error) {
      console.error('Warm transfer failed:', error);
      toaster.push({
        message: 'Failed to warm transfer customer. See console.',
        variant: 'error',
      });
    } finally {
      setIsTransferring(false);
    }
  };
  

  if (!TaskHelper.isLiveCall(task)) {
    return null;
  }

  return (
    <Button
      onClick={handleWarmTransfer}
      variant="primary"
      size="small"
      disabled={isTransferring}
    >
      {isTransferring ? 'Transferring...' : 'Warm Transfer'}
    </Button>
  );
};

export default withTaskContext(WarmTransferButton);
