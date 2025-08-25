"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";

const HeroSection = () => {
  const { t } = useLanguage();
  return (
    <section>
      <div className="relative min-h-screen pt-[80px] flex flex-col justify-center items-start text-left overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url('/cover.png')",
          }}
        />

        {/* Content - Left aligned and centered vertically */}
        <div className="relative z-10 max-w-[90%] mx-auto flex flex-col items-start justify-center min-h-[calc(100vh-80px)] pl-4 md:pl-8 lg:pl-12">
          <div className="flex flex-col items-start justify-center space-y-8">
            {/* Main heading */}
            <div className="relative w-full max-w-4xl h-auto">
              <Image
                src="/title-cover.png"
                alt="Watch"
                width={1000}
                height={500}
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Description */}
            <p className="whitespace-pre-line text-left font-olds text-xl md:text-2xl lg:text-3xl text-white/90 font-light leading-relaxed max-w-4xl">
              {t("HeroSection.description")}
            </p>

            {/* Features */}
            <div className="flex flex-wrap items-start justify-start gap-6 md:gap-8 text-white/80">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-[#E0D0B9] rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-black" />
                </div>
                <span className="text-lg md:text-xl font-medium tracking-wide">
                  {t("HeroSection.list1")}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-[#E0D0B9] rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-black" />
                </div>
                <span className="text-lg md:text-xl font-medium tracking-wide">
                  {t("HeroSection.list2")}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-[#E0D0B9] rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-black" />
                </div>
                <span className="text-lg md:text-xl font-medium tracking-wide">
                  {t("HeroSection.list3")}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-left">
              <a href="#product">
                <button className="primary-btn">{t("HeroSection.button")}</button>
              </a>
            </div>

            {/* Services */}
            <div className="flex flex-col md:flex-row items-start justify-start gap-6 md:gap-12 mt-8">
              <div className="flex items-center space-x-3">
                <Image
                  src="/icon/icon-time.png"
                  alt="logo"
                  width={20}
                  height={20}
                  priority
                />
                <span className="font-olds text-lg md:text-xl text-white">
                  {t("HeroSection.service1")}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Image
                  src="/icon/icon-polish.png"
                  alt="logo"
                  width={30}
                  height={30}
                  priority
                />
                <span className="font-olds text-lg md:text-xl text-white">
                  {t("HeroSection.service2")}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Image
                  src="/icon/icon-film.png"
                  alt="logo"
                  width={20}
                  height={20}
                  priority
                />
                <span className="font-olds text-lg md:text-xl text-white">
                  {t("HeroSection.service3")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;