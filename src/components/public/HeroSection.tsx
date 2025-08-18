"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";

const HeroSection = () => {
  const { t, locale, setLocale } = useLanguage();
  return (
    <section>
      <div className="relative min-h-screen pt-[80px] flex flex-col justify-center items-start text-left overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url('/cover.jpg')",
          }}
        />
      </div>

      {/* Content */}
      <div
        className="relative z-10 max-w-[90%] mx-auto"
        style={{ marginTop: "-230px" }}
      >
        <div className="">
          {/* Main heading */}
          <div className="mb-8">
            <h2
              className="font-olds text-2xl md:text-3xl lg:text-6xl font-light text-white mb-4 tracking-wide"
              style={{ marginTop: "-300px" }}
            >
              {t("HeroSection.title")}
            </h2>
            <h1
              style={{ marginTop: "-180px" }}
              className="text-right text-6xl md:text-8xl lg:text-[29rem] font-olds font-light text-white mb-8 leading-none tracking-tight"
            >
              {t("HeroSection.subtitle")}
            </h1>
          </div>

          {/* Description */}
          <p
            className="whitespace-pre-line mt-20 text-center font-olds text-xl md:text-xl lg:text-3xl text-white/90 font-light leading-relaxed mb-12"
            style={{ marginTop: "150px" }}
          >
            {t("HeroSection.description")}
          </p>

          {/* Features */}
          <div className="flex flex-wrap items-center justify-center gap-8 mb-12 text-white/80">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-[#E0D0B9] rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-black" />
              </div>
              <span className="text-xl font-medium tracking-wide">
                {t("HeroSection.list1")}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-[#E0D0B9] rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-black" />
              </div>
              <span className="text-xl font-medium tracking-wide">
                {t("HeroSection.list2")}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-[#E0D0B9] rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-black" />
              </div>
              <span className="text-xl font-medium tracking-wide">
               {t("HeroSection.list3")}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <a href="#product">
              <button className="primary-btn">
                {t("HeroSection.button")}
              </button>
            </a>
          </div>

          <div className="text-center mt-20 flex justify-between">
            <div className="flex " style={{ alignItems: "center" }}>
              <span>
                <Image
                  src="/icon/icon-time.png"
                  alt="logo"
                  width={20}
                  height={20}
                  priority
                />
              </span>
              <span className="ml-4 font-olds text-3xl">{t("HeroSection.service1")}</span>
            </div>
            <div className="flex " style={{ alignItems: "center" }}>
              <span>
                <Image
                  src="/icon/icon-polish.png"
                  alt="logo"
                  width={30}
                  height={30}
                  priority
                />
              </span>
              <span className="ml-4 font-olds text-3xl">
                {t("HeroSection.service2")}
              </span>
            </div>
            <div className="flex " style={{ alignItems: "center" }}>
              <span>
                <Image
                  src="/icon/icon-film.png"
                  alt="logo"
                  width={20}
                  height={20}
                  priority
                />
              </span>
              <span className="ml-4 font-olds text-3xl">{t("HeroSection.service3")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
