"use client";
import React, { useState } from 'react';
import { X } from 'lucide-react';

const StickyBottomBar = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-black text-white shadow-2xl z-50 animate-slide-up">
      <div className="relative px-4 py-4 flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Content */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-lg">⌚</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-400">NEW LUXURY WATCH COLLECTION</h3>
              <p className="text-gray-300 text-sm">Discover premium timepieces</p>
            </div>
          </div>
        </div>

        {/* Center Content */}
        <div className="hidden md:flex items-center space-x-8">
          <button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-2 rounded-lg transition-colors duration-200 transform hover:scale-105">
            SHOP NOW
          </button>
          <div className="text-center">
            <p className="text-gray-300 text-sm">CONSIGNMENT/SELL</p>
            <p className="text-white font-medium">A WATCH</p>
          </div>
          <button className="bg-transparent border border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black font-semibold px-6 py-2 rounded-lg transition-all duration-200">
            APPOINTMENT
          </button>
        </div>

        {/* Mobile Content */}
        <div className="md:hidden flex items-center space-x-3">
          <button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded text-sm transition-colors duration-200">
            SHOP NOW
          </button>
          <button className="bg-transparent border border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black font-semibold px-4 py-2 rounded text-sm transition-all duration-200">
            SELL
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 p-1 hover:bg-gray-700 rounded-full transition-colors duration-200 group"
          aria-label="Close banner"
        >
          <X size={16} className="text-gray-400 group-hover:text-white" />
        </button>
      </div>

      {/* Decorative border */}
      <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"></div>
    </div>
  );
};

export default StickyBottomBar;