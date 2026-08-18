'use client';

import { toast } from './toast';

export function useToast() {
  return {
    toast: (props: {
      title?: string;
      description?: string;
      variant?: 'default' | 'destructive';
    }) => {
      toast.add({
        title: props.title || '',
        description: props.description || '',
        type: props.variant === 'destructive' ? 'error' : 'info',
      });
    },
  };
}