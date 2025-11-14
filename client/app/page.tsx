"use client";
import React, { JSX } from 'react';
import { Header } from '../components/header/Header';
import { BodyContent } from '../components/body/BodyContent';
import { Footer } from '../components/footer/Footer';

export default function HomePage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <BodyContent />
      <Footer />
    </div>
  );
}
