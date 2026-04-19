'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';

import { CustomButton, CustomInputField } from '@/components/shared';
import { resetCardPin } from '@/services';
import { showErrorToast, showSuccessToast } from '@/lib/toast';

interface ResetCardPinDialogProps {
  studentId: string;
  cardSerialNumber?: string;
  onSuccess?: () => void;
}

const ResetCardPinDialog: React.FC<ResetCardPinDialogProps> = ({
  studentId,
  cardSerialNumber,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!newPin) {
      showErrorToast('Please enter a new PIN');
      return;
    }

    if (newPin !== confirmPin) {
      showErrorToast('PINs do not match');
      return;
    }

    setLoading(true);
    try {
      await resetCardPin({
        student_id: String(studentId),
        card_serial_number: String(cardSerialNumber || ''),
        new_card_pin: String(newPin),
        reason: String(reason || 'Admin reset'),
      });

      showSuccessToast('Card PIN reset successfully');
      setOpen(false);
      setNewPin('');
      setConfirmPin('');
      setReason('');
      onSuccess?.();
    } catch (err) {
      // show error toast
      showErrorToast(err, 'Failed to reset card PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <CustomButton
          type="button"
          text="Reset PIN"
          className="py-1 px-4 border-2 text-red-600 border-red-600 hover:bg-red-600 hover:text-white rounded-full bg-transparent"
        />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Reset Card PIN</DialogTitle>
          <DialogDescription>
            Reset the card PIN for this student. This action will overwrite the
            current PIN.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 mt-4">
          <CustomInputField
            label="Card Serial Number"
            type="text"
            value={cardSerialNumber || ''}
            readOnly
          />

          <CustomInputField
            label="New PIN"
            type="password"
            value={newPin}
            onChange={setNewPin}
            placeholder="Enter new PIN"
          />

          <CustomInputField
            label="Confirm PIN"
            type="password"
            value={confirmPin}
            onChange={setConfirmPin}
            placeholder="Confirm new PIN"
          />

          <CustomInputField
            label="Reason"
            type="text"
            value={reason}
            onChange={setReason}
            placeholder="Reason for PIN reset"
          />

          <DialogFooter className="pt-4">
            <CustomButton
              type="submit"
              text={loading ? 'Resetting...' : 'Reset PIN'}
              className="bg-red-600 text-white"
              disabled={loading}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResetCardPinDialog;
