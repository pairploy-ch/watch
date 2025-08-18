"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function BrowseButton() {
  const router = useRouter();

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // 1) update query string แบบ client-side (ไม่ reload)
    router.push("?newArrivals=true", { scroll: false });

    // 2) scroll ไปที่ element ที่มี id="product"
    const el = document.getElementById("product");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, [router]);

  return (
    <button
      className="primary-btn mt-2"
      onClick={handleClick}
    >
      Browse more new arrivals
    </button>
  );
}
