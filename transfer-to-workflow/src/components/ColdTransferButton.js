import React, { useState } from 'react';
import { Actions, TaskHelper, withTaskContext } from '@twilio/flex-ui';
import { Button } from '@twilio-paste/core/button';
import { useToaster } from '@twilio-paste/core/toast';

const ColdTransferButton = ({ task }) => {
  const [isTransferring, setIsTransferring] = useState(false);
  const toaster = useToaster();

  const handleColdTransfer = async () => {
    setIsTransferring(true);
    try {
      const customerCallSid = task.attributes?.conference?.participants?.customer;

      if (!customerCallSid) {
        console.error('Customer participant missing from task attributes.', task.attributes);
        toaster.push({
          message: 'Conference info missing. Cannot transfer call.',
          variant: 'error',
        });
        setIsTransferring(false);
        return;
      }

      // POST to your cold-transfer-redirect Serverless function
      const response = await fetch('https://transfer-to-workflow-4057.twil.io/cold-transfer-redirect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          customerCallSid,
          twimlUrl: 'https://handler.twilio.com/twiml/EHace33a8f87ed5d17731de9c67aa3d29b' // Your TwiML Bin URL
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      toaster.push({
        message: 'Cold Transfer initiated. Customer being redirected.',
        variant: 'success',
      });
    } catch (error) {
      console.error('Cold transfer failed:', error);
      toaster.push({
        message: 'Failed to cold transfer customer. See console.',
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
      onClick={handleColdTransfer}
      variant="destructive"
      size="small"
      disabled={isTransferring}
    >
      {isTransferring ? 'Transferring...' : 'Cold Transfer'}
    </Button>
  );
};

export default withTaskContext(ColdTransferButton);
