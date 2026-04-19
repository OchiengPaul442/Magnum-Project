import React from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from './api/swrConfig';
import CustomToast from '@/components/toast/CustomToast';

export const showErrorToast = (error: unknown, fallback?: string) => {
  const message =
    typeof error === 'string'
      ? error
      : getErrorMessage(error) || fallback || 'An unexpected error occurred.';

  // Render a custom toast with progress and pause-on-hover
  toast.custom((t) =>
    React.createElement(CustomToast, {
      t,
      type: 'error',
      message: String(message),
      duration: 6000,
    }),
  );
};

export const showSuccessToast = (message: string, fallback?: string) => {
  const msg = message || fallback || 'Success';
  toast.custom((t) =>
    React.createElement(CustomToast, {
      t,
      type: 'success',
      message: String(msg),
      duration: 4000,
    }),
  );
};
