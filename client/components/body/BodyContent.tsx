import Image from 'next/image'; // For Next.js Image optimization
import React, { JSX } from 'react';

export function BodyContent(): JSX.Element {
  return (
    <main className="p-5 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-5">
        
        {/* Left Section (Laptop Ad) */}
        <div className="relative flex-2 overflow-hidden rounded-lg shadow-xl">
          <Image 
            src="/first.jpeg" // Image from public directory
            alt="High-performance second-hand laptop" 
            width={800}
            height={400}
            className="w-full object-cover"
          />
          <div className="absolute top-4 left-0 bg-orange-600/90 text-white p-3 pr-6 text-xl font-bold rounded-r-lg">
            Get a <span className="underline">high-performance</span> second-hand things at an <span className="text-yellow-300">unbeatable price</span>
          </div>
        </div>
        
        {/* Right Section (Billboard) */}
        <div className="flex-1 overflow-hidden rounded-lg shadow-xl">
          <Image 
            src="/second.jpeg"
            alt="Special offer advertisement"
            width={400}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </main>
  );
}
