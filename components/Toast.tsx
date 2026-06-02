'use client';

import type { ReactNode } from 'react';
import { Toaster, toast as sonnerToast } from 'sonner';

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        expand
        richColors
        closeButton
        duration={5000}
        toastOptions={{
          style: {
            fontSize: '15px',
            fontWeight: 500,
          },
        }}
      />
    </>
  );
}

export function useToast() {
  return {
    success: (msg: string) => sonnerToast.success(msg, { duration: 5000 }),
    error: (msg: string) => sonnerToast.error(msg, { duration: 8000 }),
    warning: (msg: string) => sonnerToast.warning(msg, { duration: 6000 }),
    info: (msg: string) => sonnerToast.info(msg, { duration: 5000 }),
    loading: (msg: string) => sonnerToast.loading(msg),
    dismiss: (id?: string | number) => sonnerToast.dismiss(id),
  };
}