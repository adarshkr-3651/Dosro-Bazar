'use client'
import React from 'react';

export default function SkeletonLoader({ height = 16, width = '100%', radius = 6 }) {
  return (
    <div style={{background: '#e5e7eb', height, width, borderRadius: radius}} />
  );
}
