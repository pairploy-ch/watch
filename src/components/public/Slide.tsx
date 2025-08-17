"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; // ต้อง import module นี้
import "swiper/css";
import "swiper/css/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function WatchSlider() {
  const watches = [
    { img: "/newArrival/watch.png", name: "Rolex Green" },
    { img: "/newArrival/watch.png", name: "Rolex Rose Gold" },
    { img: "/newArrival/watch.png", name: "Rolex Submariner" },
    { img: "/newArrival/watch.png", name: "Rolex Daytona" },
  ];

  return (
    <div className="flex" style={{ alignItems: "flex-end" }}>
      {/* ปุ่มลูกศรซ้าย
      <div className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 bg-black/50 rounded-full cursor-pointer">
        <span className="text-white text-xl">‹</span>
      </div> */}

      {/* ปุ่มลูกศรขวา
      <div className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 bg-black/50 rounded-full cursor-pointer">
        <span className="text-white text-xl">›</span>
      </div> */}
      <div className="flex" style={{marginRight: '-50px'}}>
        <div
          className="flex justify-center swiper-button-prev-custom w-10 h-10 bg-none rounded-full cursor-pointer"
          style={{ border: "1px solid #fff", alignItems: "center" }}
        >
          <ChevronLeft className="h-7 w-7 text-white" />
        </div>
        <div
          className="flex justify-center swiper-button-next-custom  w-10 h-10 bg-none rounded-full cursor-pointer ml-7"
          style={{ border: "1px solid #fff", alignItems: "center" }}
        >
          <ChevronRight className="h-7 w-7 text-white" />
        </div>
      </div>
      <div
        className="-rotate-90 text-xl"
        style={{
          fontWeight: "100",
          fontSize: "52px",
          marginRight: "-60px",
          marginBottom: "90px",
        }}
      >
        Premium
      </div>
      <div className="max-w-5xl">
        <Swiper
          modules={[Navigation]}
          spaceBetween={20}
          slidesPerView={2.5}
          loop={false}
          navigation={{
            prevEl: ".swiper-button-prev-custom",
            nextEl: ".swiper-button-next-custom",
          }}
        >
          {watches.map((watch, index) => (
            <SwiperSlide key={index}>
              <div className="bg-[#141519] text-white rounded-sm overflow-hidden">
                <img src={watch.img} alt={watch.name} className="w-full" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
