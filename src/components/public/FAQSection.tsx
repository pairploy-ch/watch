"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";

export default function FAQSection() {
  const { t, locale, setLocale } = useLanguage();

  const faqs = [
    {
      q: t("FAQSection.q1"),
      a: t("FAQSection.a1"),
    },
    {
      q: t("FAQSection.q2"),
      a: t("FAQSection.a2"),
    },
    {
      q: t("FAQSection.q3"),
      a: t("FAQSection.a3"),
    },
    {
      q: t("FAQSection.q4"),
      a: t("FAQSection.a4"),
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 bg-black text-white pt-5 mt-10">
      {/* Left Side Image */}
      <div className="relative w-full h-[500px] md:h-auto">
        <Image
          src="/faq.png"
          alt="Watch"
          fill
          className="object-cover"
          style={{ aspectRatio: "1/1" }}
        />
      </div>

      {/* Right Side FAQ */}
      <div className="p-8 md:p-12 flex flex-col justify-center max-w-[90%]">
        <h2 className="text-5xl font-light text-[#B79B76] mb-8 font-olds">
          FAQs
        </h2>

        <div className="space-y-4 cursor-pointer">
          {faqs.map((item, idx) => (
            <div key={idx} className="border-b border-gray-700 pb-4">
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex justify-between items-center text-left cursor-pointer"
              >
                <span className="font-semibold text-lg">{item.q}</span>
                {openIndex === idx ? (
                  <Minus className="w-5 h-5" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </button>

              {openIndex === idx && (
                <p className="mt-3 text-gray-300 leading-relaxed">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
