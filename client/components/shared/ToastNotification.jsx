'use client'
import React, { useEffect } from 'react';

// Minimal toast wrapper to avoid adding dependencies. For a full solution, replace with react-hot-toast.
export default function ToastNotification({ message, visible = false, duration = 3000, onClose }) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => onClose && onClose(), duration);
    return () => clearTimeout(t);
  }, [visible, duration, onClose]);

  if (!visible) return null;
  return (
    <div style={{position: 'fixed', right: 20, bottom: 20, background: '#111827', color: '#fff', padding: '10px 14px', borderRadius: 8}}>
      {message}
    </div>
  );
}
