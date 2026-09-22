import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastMessage, ToastType } from '../types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface ToastContextValue {
  showToast: (first: ToastType | string, second?: string | ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((first: ToastType | string, second?: string | ToastType) => {
    let type: ToastType = 'info';
    let message = '';

    if (first === 'success' || first === 'error' || first === 'info') {
      type = first;
      message = typeof second === 'string' ? second : '';
    } else {
      message = String(first);
      if (second === 'success' || second === 'error' || second === 'info') {
        type = second;
      }
    }

    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  const success = useCallback((message: string) => showToast('success', message), [showToast]);
  const error = useCallback((message: string) => showToast('error', message), [showToast]);
  const info = useCallback((message: string) => showToast('info', message), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info }}>
      {children}
      <div
        id="toast-container"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-center gap-2.5 rounded-full px-4 py-3 text-sm font-semibold shadow-lg backdrop-blur-xl ${
                t.type === 'error'
                  ? 'border border-danger/30 bg-danger/90 text-white'
                  : t.type === 'success'
                  ? 'border border-leaf/30 bg-ink text-white'
                  : 'border border-foreground/15 bg-ink text-white'
              }`}
            >
              {t.type === 'success' && <CheckCircle2 className="size-4 shrink-0 text-success" />}
              {t.type === 'error' && <AlertCircle className="size-4 shrink-0 text-red-200" />}
              {t.type === 'info' && <Info className="size-4 shrink-0 text-sky-300" />}
              <span className="max-w-xs">{t.message}</span>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="ml-1 text-white/70 hover:text-white"
                aria-label="Fechar notificação"
              >
                <X className="size-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
