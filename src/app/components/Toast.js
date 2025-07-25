'use client';
import React, { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  }[type] || 'bg-blue-500';

  return (
    <div className={`fixed top-5 right-5 px-4 py-2 rounded text-white shadow-lg ${bgColor}`}>
      {message}
    </div>
  );
}
