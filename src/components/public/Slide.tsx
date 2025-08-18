"use client";

import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; // ต้อง import module นี้
import "swiper/css";
import "swiper/css/navigation";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function WatchSlider() {
  const router = useRouter();
  const watches = [
    { img: "/newArrival/watch.png", name: "Rolex Green" },
    { img: "/newArrival/watch.png", name: "Rolex Rose Gold" },
    { img: "/newArrival/watch.png", name: "Rolex Submariner" },
    { img: "/newArrival/watch.png", name: "Rolex Daytona" },
  ];

  return (
    <div>
      {/* Desktop Layout - หน้าจอใหญ่กว่า 1200px */}
      <div className="hidden xl:flex" style={{ alignItems: "flex-end" }}>
        <div className="flex" style={{ marginRight: '-50px' }}>
          <div
            className="flex justify-center swiper-button-prev-custom w-10 h-10 bg-none rounded-full cursor-pointer"
            style={{ border: "1px solid #fff", alignItems: "center" }}
          >
            <ChevronLeft className="h-7 w-7 text-white" />
          </div>
          <div
            className="flex justify-center swiper-button-next-custom w-10 h-10 bg-none rounded-full cursor-pointer ml-7"
            style={{ border: "1px solid #fff", alignItems: "center" }}
          >
            <ChevronRight className="h-7 w-7 text-white" />
          </div>
        </div>
        <div
          className="-rotate-90 text-xl  hidden lg:block"
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
                <div className="bg-[#141519] text-white rounded-sm overflow-hidden cursor-pointer" onClick={() => router.push("/watch/1")}>
                  <img src={watch.img} alt={watch.name} className="w-full" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Mobile/Tablet Layout - หน้าจอ 1200px ลงไป */}
      <div className="block xl:hidden bg-cover bg-center bg-no-repeat" 
           style={{ backgroundImage: "url('/path/to/your/background-image.jpg')" }}>
        <div className="text-center pt-8 pb-8">
          <h2 className="text-white text-3xl md:text-4xl font-light">Premium</h2>
        </div>
        
        <div className="max-w-sm sm:max-w-xl mx-auto px-4">
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1} // sm ลงไป แสดง 1 การ์ด
            breakpoints={{
              640: { // md ขึ้นไป แสดง 2 การ์ด
                slidesPerView: 2,
              },
            }}
            loop={false}
            navigation={{
              prevEl: ".swiper-button-prev-mobile",
              nextEl: ".swiper-button-next-mobile",
            }}
          >
            {watches.map((watch, index) => (
              <SwiperSlide key={index}>
                <div className="bg-[#141519] text-white rounded-sm overflow-hidden cursor-pointer" onClick={() => router.push("/watch/1")}>
                  <img src={watch.img} alt={watch.name} className="w-full h-auto" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Navigation buttons ด้านล่าง */}
          <div className="flex justify-center mt-8 pb-8 space-x-4">
            <div
              className="flex justify-center swiper-button-prev-mobile w-12 h-12 bg-none rounded-full cursor-pointer"
              style={{ border: "1px solid #fff", alignItems: "center" }}
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </div>
            <div
              className="flex justify-center swiper-button-next-mobile w-12 h-12 bg-none rounded-full cursor-pointer"
              style={{ border: "1px solid #fff", alignItems: "center" }}
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}