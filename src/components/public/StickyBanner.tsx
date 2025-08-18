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
    <div className="max-h-[250px] fixed bottom-0 left-0 right-0 bg-[#000] text-white shadow-2xl z-50 animate-slide-up">
      <div className="relative flex items-center justify-between mx-auto max-w-full">
        {/* Desktop Layout - sm ขึ้นไป */}
        <div className="hidden sm:flex items-center justify-between w-full">
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
          <div className="grid grid-cols-2 gap-8 w-1/2 items-center">
            {/* Left 50% of center content */}
            <div>
              <h1
                className="whitespace-pre-line sm:text-sm md:text-xl lg:text-2xl font-light text-white mb-2 font-olds"
                style={{ lineHeight: 1.3 }}
              >
                {t("StickyBanner.buy")}
              </h1>
              <a href="https://line.me/R/ti/p/@939hmulm?ts=05061404&oat_content=url">
                <button
                  className="sm:py-[10px] sm:px-[20px] md:px-[20px] lg:px-[20px] xl:px-[60px] whitespace-pre-line primary-btn text-black px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-300"
                >
                  SHOP NOW
                </button>
              </a>
            </div>

            {/* Right 50% of center content */}
            <div>
              <h1
                className="whitespace-pre-line sm:text-sm md:text-xl lg:text-2xl font-light text-white mb-2 font-olds"
                style={{ lineHeight: 1.3 }}
              >
                {t("StickyBanner.sell")}
              </h1>
              <a href="https://line.me/R/ti/p/@939hmulm?ts=05061404&oat_content=url">
                <button
                  className="sm:py-[10px] sm:px-[20px] md:px-[20px] lg:px-[20px] xl:px-[60px] whitespace-pre-line primary-btn text-black px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-300"
                >
                  APPOINTMENT
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Layout - sm ลงไป */}
        <div className="sm:hidden relative w-full aspect-[5/1]">
          {/* Background Image */}
          <Image
            src="/sticky-banner.png"
            alt="logo"
            width={1000}
            height={250}
            className="object-cover object-center w-full h-full"
          />
          
          {/* Overlay Content */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="grid grid-cols-2 gap-4 w-[90%] mx-auto px-4">
              {/* Left Section */}
              <div className="text-left">
                <h1
                  className="whitespace-pre-line text-xl font-light text-white mb-2 font-olds"
                  style={{ lineHeight: 1.2 }}
                >
                  {t("StickyBanner.buy")}
                </h1>
                <a href="https://line.me/R/ti/p/@939hmulm?ts=05061404&oat_content=url">
                  <button className="primary-btn text-black text-xs font-semibold tracking-wide transition-colors duration-300" style={{padding: '10px 20px'}}>
                    SHOP NOW
                  </button>
                </a>
              </div>

              {/* Right Section */}
              <div className="text-left">
                <h1
                  className="whitespace-pre-line text-xl font-light text-white mb-2 font-olds"
                  style={{ lineHeight: 1.2 }}
                >
                  {t("StickyBanner.sell")}
                </h1>
                <a href="https://line.me/R/ti/p/@939hmulm?ts=05061404&oat_content=url">
                   <button className="primary-btn text-black text-xs font-semibold tracking-wide transition-colors duration-300" style={{padding: '10px 20px'}}>
                    APPOINTMENT
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 p-1 hover:bg-gray-700 rounded-full transition-colors duration-200 group z-10"
          aria-label="Close banner"
        >
          <X size={16} className="text-gray-400 group-hover:text-white" />
        </button>
      </div>
    </div>
  );
};

export default StickyBottomBar;