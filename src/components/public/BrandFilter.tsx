"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import Image from "next/image";

interface Brand {
  name: string;
  image: string;
  alt: string;
}

const brands: Brand[] = [
  { name: "Cartier", image: "/brands/brand1.png", alt: "Cartier logo" },
  { name: "Rolex", image: "/brands/brand2.png", alt: "Rolex logo" },
  { name: "Patek", image: "/brands/brand3.png", alt: "Patek Philippe logo" },
  {
    name: "Richard Mille",
    image: "/brands/brand4.png",
    alt: "Richard Mille logo",
  },
  {
    name: "Audemars Piguet",
    image: "/brands/brand5.png",
    alt: "Audemars Piguet logo",
  },
  {
    name: "franck muller",
    image: "/brands/brand6.png",
    alt: "franck muller logo",
  },

  { name: "Omega", image: "/brands/brand7.png", alt: "Omega logo" },
];

export default function BrandLogos() {
  const router = useRouter();

  const handleBrandClick = useCallback(
    (brandName: string) => {
      // Navigate to product page with brand filter
      router.push(`?brand=${brandName.toLowerCase()}`, { scroll: false });

      // Scroll to product section
      const productSection = document.getElementById("product");
      if (productSection) {
        productSection.scrollIntoView({ behavior: "smooth" });
      }
    },
    [router]
  );

  return (
    <div className="flex overflow-x-auto gap-8 py-10 lg:pt-10 max-w-[90%] mx-auto mt-10 scrollbar-none items-center justify-between">
      {brands.map((brand, index) => (
        <div
          key={brand.name}
          className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => handleBrandClick(brand.name)}
        >
          <Image
            src={brand.image}
            alt={brand.alt}
            width={140}
            height={60}
            priority={index < 3}
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
