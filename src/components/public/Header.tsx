"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { CircleUser, Menu, X, Search, Globe } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Watch } from "@/lib/types";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface HeaderProps {
  watches: Watch[];
}

export default function Header({ watches }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("ENG");
  const searchRef = useRef<HTMLInputElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const handleSelect = (id: number) => {
    setShowDropdown(false);
    setSearch("");
    setShowSearch(false);
    router.push(`/watch/${id}`);
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 100);
    } else {
      setSearch("");
      setShowDropdown(false);
    }
  };

  const filtered = search.trim()
    ? watches
        .filter((w) =>
          [w.brand, w.model, w.ref]
            .filter(Boolean)
            .some((val) =>
              val?.toLowerCase().includes(search.trim().toLowerCase())
            )
        )
        .slice(0, 8)
    : [];

  // Logic for hiding header on scroll
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (typeof previous === "number" && latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
        setSearch("");
        setShowDropdown(false);
      }
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/#inventory", label: "COLLECTION" },
    { href: "/#about", label: "ABOUT" },
    { href: "/#contact", label: "CONTACT" },
  ];

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="absolute top-0 left-0 w-full z-50"
    >
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center min-h-[80px]">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-bg.png"
            alt="logo"
            width={100}
            height={100}
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-12">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-white hover:text-gray-300 transition-colors duration-300 text-sm tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden lg:flex items-center space-x-3">
          {/* Language Selector */}
          <div
            className="relative bg-[#262624] px-4 py-2 rounded-full"
            ref={languageRef}
          >
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors duration-300"
            >
              {/* <Globe className="h-4 w-4" /> */}
              <span className="text-sm font-medium">{selectedLanguage}</span>
              <svg
                className={`h-4 w-4 transition-transform duration-200 ${
                  showLanguageDropdown ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Language Dropdown */}
            {showLanguageDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-24 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl z-50"
              >
                <div className="py-1">
                  <button
                    onClick={() => {
                      setSelectedLanguage("ENG");
                      setShowLanguageDropdown(false);
                    }}
                    className={`block w-full text-left px-3 py-2 text-sm transition-colors duration-200 ${
                      selectedLanguage === "ENG"
                        ? "bg-white/20 text-white"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    ENG
                  </button>
                  <button
                    onClick={() => {
                      setSelectedLanguage("THAI");
                      setShowLanguageDropdown(false);
                    }}
                    className={`block w-full text-left px-3 py-2 text-sm transition-colors duration-200 ${
                      selectedLanguage === "THAI"
                        ? "bg-white/20 text-white"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    THAI
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Search */}
          <div className="relative" ref={searchRef}>
            {!showSearch ? (
              <button
                onClick={handleSearchToggle}
                className="p-2 text-white hover:text-gray-300 transition-colors duration-300"
              >
                <Search className="h-5 w-5" />
              </button>
            ) : (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center"
              >
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search className="h-4 w-4" />
                  </div>
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Search luxury watches..."
                    className="pl-10 pr-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/40 w-full transition-all duration-300 placeholder-gray-400"
                    autoComplete="off"
                  />

                  {/* Search Dropdown */}
                  {showDropdown && filtered.length > 0 && (
                    <div className="absolute left-0 mt-2 w-full bg-black/90 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-50 max-h-80 overflow-auto">
                      <div className="p-2">
                        {filtered.map((watch) => (
                          <button
                            key={watch.id}
                            type="button"
                            className="block w-full text-left px-4 py-3 text-sm text-white hover:bg-white/10 transition-all duration-300 cursor-pointer rounded-lg"
                            onMouseDown={() => handleSelect(watch.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="font-bold text-white mr-2">
                                  {watch.brand}
                                </span>
                                <span className="text-gray-300">
                                  {watch.model || watch.ref}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {watch.ref}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSearchToggle}
                  className="ml-2 p-2 text-white hover:text-gray-300 transition-colors duration-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </div>

          {/* User Profile */}
          <Link
            href="/login"
            className="p-0 text-white hover:text-gray-300 transition-colors duration-300"
          >
            <CircleUser className="h-5 w-5" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-white hover:text-gray-300 transition-colors duration-300 z-50"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden fixed inset-0 bg-black/95 backdrop-blur-md z-40 flex flex-col"
        >
          <div className="flex-1 flex flex-col items-center justify-center px-6 space-y-8">
            {/* Mobile Search Bar */}
            <div className="w-full max-w-sm relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 120)}
                placeholder="Search luxury watches..."
                className="pl-10 pr-4 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-base text-white focus:outline-none focus:ring-1 focus:ring-white/30 w-full transition-all duration-300 placeholder-gray-400"
                autoComplete="off"
              />

              {/* Mobile Search Dropdown */}
              {showDropdown && filtered.length > 0 && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-full bg-black/90 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-50 max-h-60 overflow-auto">
                  <div className="p-2">
                    {filtered.map((watch) => (
                      <button
                        key={watch.id}
                        type="button"
                        className="block w-full text-left px-4 py-3 text-sm text-white hover:bg-white/10 transition-all duration-300 cursor-pointer rounded-lg"
                        onMouseDown={() => {
                          handleSelect(watch.id);
                          setIsMenuOpen(false);
                        }}
                      >
                        <div>
                          <span className="font-bold text-white mr-2">
                            {watch.brand}
                          </span>
                          <span className="text-gray-300">
                            {watch.model || watch.ref}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Navigation Links */}
            <div className="w-full space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-center text-xl font-medium text-white hover:text-gray-300 transition-colors duration-300 py-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Language & User */}
            <div className="flex items-center space-x-8">
              <div className="relative">
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors duration-300"
                >
                  <Globe className="h-5 w-5" />
                  <span className="font-medium">{selectedLanguage}</span>
                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${
                      showLanguageDropdown ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Mobile Language Dropdown */}
                {showLanguageDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-24 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl z-50"
                  >
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setSelectedLanguage("ENG");
                          setShowLanguageDropdown(false);
                        }}
                        className={`block w-full text-left px-3 py-2 text-sm transition-colors duration-200 ${
                          selectedLanguage === "ENG"
                            ? "bg-white/20 text-white"
                            : "text-gray-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        ENG
                      </button>
                      <button
                        onClick={() => {
                          setSelectedLanguage("THAI");
                          setShowLanguageDropdown(false);
                        }}
                        className={`block w-full text-left px-3 py-2 text-sm transition-colors duration-200 ${
                          selectedLanguage === "THAI"
                            ? "bg-white/20 text-white"
                            : "text-gray-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        THAI
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              <Link
                href="/login"
                className="p-3 text-white hover:text-gray-300 transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <CircleUser className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
