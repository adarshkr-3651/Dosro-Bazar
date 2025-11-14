"use client";
import React from 'react';

interface SkeletonProps {
  height?: number | string;
  width?: number | string;
  radius?: number;
}

export default function SkeletonLoader({ height = 16, width = '100%', radius = 6 }: SkeletonProps) {
  return (
    <div style={{background: '#e5e7eb', height, width, borderRadius: radius}} />
  );
}
