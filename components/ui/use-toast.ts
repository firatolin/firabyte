'use client';

import { useToastManager, toast as toastManager } from './toast';

export function useToast() {
  // Return the toast function directly
  return {
    toast: (props: {
      title?: string;
      description?: string;
      variant?: 'default' | 'destructive';
    }) => {
      // Use the toast manager to add a toast
      toastManager.add({
        title: props.title || '',
        description: props.description || '',
        type: props.variant === 'destructive' ? 'error' : 'info',
      });
    },
  };
}

// Export toast function directly for convenience
export { toastManager as toast };