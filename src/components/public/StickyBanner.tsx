"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "../../../context/LanguageContext";

const StickyBottomBar = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="max-h-[250px] fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-black text-white shadow-2xl z-50 animate-slide-up">
      <div className="relative flex items-center justify-between mx-auto max-w-full">
        {/* Left Content - Image 50% */}
        <div className="w-1/2 flex items-center aspect-[5/1]">
          <Image
            src="/sticky-banner.png"
            alt="logo"
            width={1000}
            height={250}
            className="object-cover object-center w-full"
          />
        </div>

        {/* Center Content - 50% */}
        <div className="hidden md:grid lg:grid grid-cols-2 gap-8 w-1/2 items-center">
          {/* Left 50% of center content */}
          <div>
            <h1
              className="whitespace-pre-line text-xl font-light text-white mb-2 font-olds"
              style={{ lineHeight: 1.3 }}
            >
              {t("StickyBanner.buy")}
            </h1>
            <a href="https://line.me/R/ti/p/@939hmulm?ts=05061404&oat_content=url">
              <button
                className="whitespace-pre-line primary-btn text-black px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-300"
                style={{ padding: "10px 60px" }}
              >
                SHOP NOW
              </button>
            </a>
          </div>

          {/* Right 50% of center content */}
          <div>
            <h1
              className="whitespace-pre-line  text-xl font-light text-white mb-2 font-olds"
              style={{ lineHeight: 1.3 }}
            >
               {t("StickyBanner.sell")}
            </h1>
            <a href="https://line.me/R/ti/p/@939hmulm?ts=05061404&oat_content=url">
              <button
                className="primary-btn text-black px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-300"
                style={{ padding: "10px 60px" }}
              >
                APPOINTMENT
              </button>
            </a>
          </div>
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
    </div>
  );
};

export default StickyBottomBar;
