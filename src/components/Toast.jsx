import { useEffect, useState, useCallback } from 'react';

export default function Toast({ message, type = 'info', duration = 4000, onClose }) {
  const [removing, setRemoving] = useState(false);

  const close = useCallback(() => {
    setRemoving(true);
    setTimeout(() => onClose?.(), 300);
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(close, duration);
    return () => clearTimeout(timer);
  }, [close, duration]);

  const icons = { success: 'fa-solid fa-circle-check', error: 'fa-solid fa-circle-xmark', info: 'fa-solid fa-circle-info' };

  return (
    <div className={`toast toast-${type} ${removing ? 'removing' : ''}`}>
      <i className={`${icons[type] || icons.info} text-base shrink-0`} />
      <span className="flex-1 text-xs leading-snug">{message}</span>
      <button onClick={close} className="shrink-0 opacity-70 hover:opacity-100 transition ml-1">
        <i className="fa-solid fa-xmark text-xs" />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => onDismiss(t.id)} />
      ))}
    </div>
  );
}
