"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";

const ServiceSection = () => {
    const { t, locale, setLocale } = useLanguage();
  const services = [
    {
      title: t("ServiceSection.service1"),
      img: "/our-service1.png",
    },
    {
      title: t("ServiceSection.service2"),
      img: "/our-service2.png",
    },
    {
     title: t("ServiceSection.service3"),
      img: "/our-service3.png",
    },
  ];

  return (
    <div className="max-w-full mx-auto py-12 mt-10 mb-6 cursor-pointer">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-light text-[#B79B76] mb-4 font-olds">
          {t("ServiceSection.title")}
        </h1>
      </div>

      {/* Image Row */}
      <div className="grid grid-cols-1 md:grid-cols-3">
        {services.map((service, i) => (
          
          <a href="https://line.me/R/ti/p/@939hmulm?ts=05061404&oat_content=url" key={i} className="relative group overflow-hidden shadow-lg" >
            {/* Background Image */}
            <Image
              style={{ aspectRatio: "1/1" }}
              src={service.img}
              alt={service.title}
              width={500}
              height={500}
              className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-500" />

            {/* Text */}
            <div
              className="absolute inset-0 flex flex-col text-white text-xl font-light"
              style={{ padding: "60px 40px" }}
            >
              <span className="text-2xl font-olds">{service.title}</span>
              <span className="mt-2 flex items-center gap-2 opacity-80 group-hover:opacity-100 transition">
                <span className="text-sm">
                  <Image
                    src="/arrow-right.png"
                    alt="logo"
                    width={80}
                    height={20}
                    priority
                  />
                </span>
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ServiceSection;