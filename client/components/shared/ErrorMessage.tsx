"use client";
import React from 'react';

interface ErrorProps {
  error?: any;
}

export default function ErrorMessage({ error }: ErrorProps) {
  if (!error) return null;
  return (
    <div style={{background: '#fff1f2', color: '#991b1b', padding: 10, borderRadius: 6, border: '1px solid #fecaca'}}>
      {typeof error === 'string' ? error : (error.message || 'An error occurred')}
    </div>
  );
}
