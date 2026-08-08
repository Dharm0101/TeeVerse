import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type} animate-fadeInUp`}>
          <span className="toast__icon">
            {toast.type === 'success' && <CheckCircle2 size={18} color="var(--success)" />}
            {toast.type === 'error' && <AlertCircle size={18} color="var(--accent-secondary)" />}
            {toast.type === 'info' && <Info size={18} color="var(--info)" />}
          </span>
          <span className="toast__message">{toast.message}</span>
          <button className="toast__close" onClick={() => removeToast(toast.id)}>
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
