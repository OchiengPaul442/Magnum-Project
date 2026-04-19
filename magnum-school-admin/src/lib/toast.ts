import { toast } from 'sonner';
import { getErrorMessage } from './api/swrConfig';

export const showErrorToast = (error: unknown, fallback?: string) => {
  if (typeof error === 'string') {
    toast.error(error);
    return;
  }

  const message = getErrorMessage(error);
  toast.error(message || fallback || 'An unexpected error occurred.');
};

export const showSuccessToast = (message: string, fallback?: string) => {
  toast.success(message || fallback || 'Success');
};
