"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "../../../context/LanguageContext";

const Logo = () => (
  <Link href="/" className="group inline-block">
    <div className="relative">
      <Image
        src="/logo-bg.png"
        alt="Chronos Watch Logo"
        width={180}
        height={50}
        className="h-auto transition-all duration-300 group-hover:scale-105"
      />
    </div>
  </Link>
);

export default function Footer() {
  const { t, locale, setLocale } = useLanguage();
  return (
    <footer
      id="footer"
      className=""
      style={{
        backgroundImage: "linear-gradient(to right, #292930, #16171B, #16171B)",
      }}
    >
      <div className="container mx-auto py-10 max-w-[90%]">
        {/* Main Footer Content */}
        <div className="flex justify-between">
          <div>
            {/* Logo */}
            <div className="lg:col-span-1">
              <Logo />
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
              {/* Showroom */}
              <div>
                <h3 className="text-white font-medium mb-3 font-olds">
                  Showroom
                </h3>
                <p className="text-white text-sm">Gaysorn Village, Bangkok</p>
              </div>

              {/* Phone */}
              <div>
                <h3 className="text-white font-medium mb-3 font-olds">Phone</h3>
                <p className="text-white text-sm">+66 8x-xxx-xxxx</p>
              </div>

              {/* Line */}
              <div>
                <h3 className="text-white font-medium mb-3 font-olds">Line</h3>
                <p className="text-white text-sm">@chronoswatch</p>
              </div>
            </div>
          </div>

          {/* Appointment Section */}
          <div className="lg:col-span-1">
            <div className="text-right">
              <h3
                className="whitespace-pre-line  text-white text-4xl mb-4 leading-tight font-olds"
                style={{ fontWeight: 300 }}
              >
                {t("ContactSection.title")}
              </h3>
              <a href="https://line.me/R/ti/p/@939hmulm?ts=05061404&oat_content=url">
                <button
                  className="mt-4 primary-btn text-black px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-300"
                  style={{ padding: "20px 100px" }}
                >
                   {t("ContactSection.button")}
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-gray-500 text-sm">
                © 2025 Chronos Watch. All Rights Reserved.
              </p>
              <span className="text-[#B79B76] font-olds">Premium Dealer</span>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms & Conditions
              </Link>
              <span className="text-gray-600">|</span>
              <Link
                href="/warranty"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Warranty
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
