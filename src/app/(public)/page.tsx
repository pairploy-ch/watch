// "use client";
import { FC, ReactNode } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Watch, WatchMedia } from "@/lib/types";
import { useLanguage } from "../../../context/LanguageContext";
// import dynamic from "next/dynamic";
// import { Swiper, SwiperSlide } from "swiper/react";
import {
  Phone,
  MessageCircle,
  MapPin,
  Star,
  Shield,
  Award,
  Clock,
  Check,
} from "lucide-react";
import Header from "@/components/public/Header";
import Slide from "@/components/public/Slide";
import WatchProductPage from "@/components/public/WatchProductPage";
import FAQSection from "@/components/public/FAQSection";
import Image from "next/image";
// import Link from "next/link";
import BrowseButton from "@/components/public/BrowseNewArrival";
import BrandFilter from "@/components/public/BrandFilter";
import StickyBanner from "@/components/public/StickyBanner";


// Dynamically import InventorySection as a Client Component
// const InventorySection = dynamic(
//   () => import("@/components/public/InventorySection"),
//   {
//     loading: () => (
//       <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
//         <div className="text-center space-y-6">
//           <div className="relative">
//             <div className="w-16 h-16 mx-auto border-4 border-amber-200 border-t-transparent rounded-full animate-spin"></div>
//             <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-amber-500/30 rounded-full animate-pulse"></div>
//           </div>
//           <p className="text-amber-200 font-semibold text-xl tracking-wide">
//             Loading Exclusive Collection...
//           </p>
//           <p className="text-gray-400 text-sm">
//             Preparing timeless masterpieces
//           </p>
//         </div>
//       </div>
//     ),
//   }
// );


// Helper components
const Section: FC<{
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}> = ({ id, title, children, className = "" }) => (
  <div id={id} className={`relative ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black/80 to-gray-900/50"></div>
    <div className="relative z-10 container mx-auto px-4 md:px-6 py-16 md:py-24">
      <div className="text-center mb-12 md:mb-16">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200 bg-clip-text text-transparent mb-4">
          {title}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto"></div>
      </div>
      {children}
    </div>
  </div>
);

const TestimonialCard: FC<{
  name: string;
  text: string;
  watch: string;
  image: string;
}> = ({ name, text, watch, image }) => (
  <div
    className="overflow-hidden flex flex-col p-10 pb-0"
    style={{ backgroundImage: "linear-gradient(to right, #2C2C33, #141519)" }}
  >
    {/* Stars */}
    <div className="flex items-center gap-1pt-6">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-4 h-4 text-[#B79B76] fill-current" />
      ))}
    </div>

    {/* Review Text */}
    <div className="py-4">
      <p className="text-gray-200 italic text-base leading-relaxed line-clamp-3">
        {text}
      </p>
    </div>

    {/* Image */}
    <div className="w-full h-60 relative">
      <Image src={image} alt={name} fill className="object-cover" />
    </div>

    {/* Reviewer Info */}
    <div
      className="flex items-center gap-3 py-4 mt-3"
      style={{ marginBottom: "20px" }}
    >
      {/* Avatar Placeholder */}
      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm">
        {name.charAt(0)}
      </div>
      <div>
        <p className="font-semibold text-white">{name}</p>
        <p className="text-sm text-gray-400">{watch}</p>
      </div>
    </div>
  </div>
);

const FeatureCard: FC<{
  icon: ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="group relative from-gray-900 via-black to-gray-900 p-6 md:p-8 rounded-2xl transition-all duration-500 ">
    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-2xl opacity-0  transition-opacity duration-500"></div>
    <div className="relative z-10">
      <div className="flex" style={{ alignItems: "center" }}>
        <div
          style={{ color: "#fff !important" }}
          className="w-16 h-16 mb-4 bg-[#3C3C3C]  rounded-[5px] flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
        >
          {icon}
        </div>
        <h3 className="text-xl md:text-3xl font-bold text-white mb-3 font-olds ml-5">
          {title}
        </h3>
      </div>

      <p className="text-white leading-relaxed text-lg w-[100%] mt-4">
        {description}
      </p>
    </div>
  </div>
);

const HeroSection = () => (
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
            Timeless
          </h2>
          <h1
            style={{ marginTop: "-180px" }}
            className="text-right text-6xl md:text-8xl lg:text-[29rem] font-olds font-light text-white mb-8 leading-none tracking-tight"
          >
            elegance
          </h1>
        </div>

        {/* Description */}
        <p
          className="mt-20 text-center font-olds text-xl md:text-xl lg:text-3xl text-white/90 font-light leading-relaxed mb-12"
          style={{ marginTop: "150px" }}
        >
          Discover our curated collection of the worlds finest
          <br />
          pre-owned luxury watches
        </p>

        {/* Features */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-12 text-white/80">
          {["100% Authentic", "Certified Quality", "Lifetime Support"].map(
            (feature, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div
                  className="w-5 h-5 bg-[#E0D0B9] rounded-full flex justify-center"
                  style={{ alignItems: "center" }}
                >
                  <Check className="w-3 h-3 text-black" />
                </div>
                <span className="text-xl font-medium tracking-wide">
                  {feature}
                </span>
              </div>
            )
          )}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <a href="#product">
            <button className="primary-btn">BROWSE EXCLUSIVE COLLECTION</button>
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
            <span className="ml-4 font-olds text-3xl">Buy Sell Trade</span>
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
              Polishing & Servicing
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
            <span className="ml-4 font-olds text-3xl">Protection Film</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const NewArrival = () => (
  <section className="relative" style={{ maxHeight: "1000px" }}>
    <div className="relative w-full h-[900px] mt-[150px] pt-[100px] overflow-hidden">
      <Image
        src="/bg-newarrival.png"
        alt="logo"
        fill
        priority
        className="object-cover"
      />
    </div>
    <div className="w-full mx-auto top-0 ">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full"
        style={{ paddingTop: "100px" }}
      >
        <div className="max-w-[90%] mx-auto ">
          <h2 className="font-olds text-2xl md:text-3xl lg:text-3xl font-light text-white mb-4 tracking-wide">
            Luxury Redefined
          </h2>
          <h1 className="font-olds text-2xl md:text-3xl lg:text-8xl font-light text-[#E0D0B9] mb-4 tracking-wide">
            New Arrivals
          </h1>
          <h1
            style={{ marginTop: "-20px" }}
            className="font-olds text-2xl md:text-3xl lg:text-8xl font-light text-white mb-4 tracking-wide"
          >
            Timeless Elegance
          </h1>
          {/* <a
            href="?newArrivals=true#product"
            className="primary-btn mt-2 inline-block text-center no-underline"
            style={{
              scrollBehavior: "smooth",
              textDecoration: "none",
            }}
          >
            Browse more new arrivals
          </a> */}
          <BrowseButton />
        </div>
        <div className="flex justify-end mt-10">
          <Slide />
        </div>
      </div>
    </div>
  </section>
);

const AboutSection = () => (
  <section id="about" className="relative" style={{ maxHeight: "1000px" }}>
    <div className="mt-[150px] h-[900px] relative  pt-[100px] flex flex-col justify-center items-start text-left overflow-hidden">
      {/*      
      <Image
        src="/bg-about.png"
        alt="logo"
        className="w-full"
        fill
        priority
      /> */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.5)), url('/bg-about.png')",
        }}
      />
    </div>
    <div className="w-full mx-auto top-0 ">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full"
        style={{ paddingTop: "50px" }}
      >
        <div className="max-w-[90%] mx-auto ">
          <h1
            style={{ fontWeight: 500 }}
            className="text-2xl md:text-3xl  lg:text-8xl font-light text-[#E0D0B9] mb-4 tracking-wide"
          >
            ABOUT
          </h1>
          <h1
            style={{ marginTop: "-20px" }}
            className="font-olds text-2xl md:text-3xl lg:text-8xl font-light text-[#B79B76] mb-4 tracking-wide"
          >
            CHRONOS WATCH
          </h1>
          <div style={{ width: "50%" }} className="mt-10">
            <p className="text-xl">
              At Chronos Watch, we believe a watch is not just a timepiece, but
              a legacy, a work of art, and a story on your wrist. Our mission is
              to curate exceptional pre-owned luxury watches with fascinating
              stories from around the world.
            </p>
            <p className="mt-8 text-xl">
              With expertise and passion, we meticulously inspect every watch to
              ensure you receive 100% quality and authenticity. Each piece is
              carefully selected and authenticated by our master watchmakers.
            </p>
          </div>
          <div
            className="mt-10 pb-8 pt-5 flex pl-3"
            style={{
              backgroundImage: "linear-gradient(to right, #2C2C33, #141519)",
              marginTop: "80px",
            }}
          >
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-white" />}
              title="Authentic"
              description="Every watch is thoroughly authenticated by certified experts"
            />
            <FeatureCard
              icon={<Award className="w-8 h-8 text-white" />}
              title="Quality"
              description="Rigorous inspection ensures premium condition and performance"
            />
            <FeatureCard
              icon={<Star className="w-8 h-8 text-white" />}
              title="Exclusive"
              description="Rare and limited pieces from prestigious manufacturers"
            />
            <FeatureCard
              icon={<Clock className="w-8 h-8 text-white" />}
              title="Legacy"
              description="Timeless pieces that retain and increase their value"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
  // <Section id="about" title="About Chronos Watch">
  //   <div className="max-w-4xl mx-auto">
  //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
  //       <div className="space-y-6">
  //         <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8 rounded-2xl border border-gray-800">
  //           <p className="text-gray-300 text-lg leading-relaxed mb-6">
  //             At Chronos Watch, we believe a watch is not just a timepiece, but
  //             a legacy, a work of art, and a story on your wrist. Our mission is
  //             to curate exceptional pre-owned luxury watches with fascinating
  //             stories from around the world.
  //           </p>
  //           <p className="text-gray-300 text-lg leading-relaxed">
  //             With expertise and passion, we meticulously inspect every watch to
  //             ensure you receive 100% quality and authenticity. Each piece is
  //             carefully selected and authenticated by our master watchmakers.
  //           </p>
  //         </div>
  //       </div>

  //       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
  //         <FeatureCard
  //           icon={<Shield className="w-8 h-8 text-black" />}
  //           title="Authentic"
  //           description="Every watch is thoroughly authenticated by certified experts"
  //         />
  //         <FeatureCard
  //           icon={<Award className="w-8 h-8 text-black" />}
  //           title="Quality"
  //           description="Rigorous inspection ensures premium condition and performance"
  //         />
  //         <FeatureCard
  //           icon={<Star className="w-8 h-8 text-black" />}
  //           title="Exclusive"
  //           description="Rare and limited pieces from prestigious manufacturers"
  //         />
  //         <FeatureCard
  //           icon={<Clock className="w-8 h-8 text-black" />}
  //           title="Legacy"
  //           description="Timeless pieces that retain and increase their value"
  //         />
  //       </div>
  //     </div>
  //   </div>
  // </Section>
);

const TestimonialsSection = () => (
  <section
    id="testimonials"
    className="font-olds pt-4 max-w-[90%] mx-auto pb-4"
  >
    <div className="text-left mb-12 ">
      <h1 className="text-5xl font-light text-[#B79B76] mb-4 font-olds">
        What Our Collectors Say
      </h1>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <TestimonialCard
        name="Somchai"
        text="Excellent service. They gave me great advice and I got a watch in like-new condition. I'm truly impressed — the quality exceeded my expectations."
        watch="Rolex Submariner"
        image="/review-mock-1.png"
      />
      <TestimonialCard
        name="Mr. David"
        text="Absolutely exceptional service and authenticity. The watch exceeded my expectations. Professional, trustworthy, and highly knowledgeable team."
        watch="Patek Philippe Nautilus"
        image="/review-mock-2.png"
      />
      <TestimonialCard
        name="Wipa"
        text="I’ve been looking for this watch for a long time. Thank you for sourcing it for me — the condition is beautiful and I couldn’t be happier. Truly not disappointed, and the after-sales service is excellent as well."
        watch="Audemars Piguet Royal Oak"
        image="/review-mock-3.png"
      />
    </div>
  </section>
);

const ContactSection = () => (
  <Section id="contact" title="Connect With Us">
    <div className="max-w-[90%] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="group relative bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-amber-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Phone className="h-8 w-8 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-amber-200 mb-4">Phone</h3>
            <p className="text-gray-400 mb-6">ติดต่อสอบถาม พูดคุยรายละเอียด</p>
            <a
              href="tel:+668xxxxxxxx"
              className="inline-block bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-3 px-6 rounded-full hover:from-amber-400 hover:to-amber-500 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25"
            >
              +66 8x-xxx-xxxx
            </a>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-amber-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <MessageCircle className="h-8 w-8 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-amber-200 mb-4">
              Messaging
            </h3>
            <p className="text-gray-400 mb-6">ส่งข้อความ รูปภาพ เพื่อนัดหมาย</p>
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-3 px-6 rounded-full">
              @chronoswatch
            </div>
          </div>
        </div>

        <div className="group relative bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-amber-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <MapPin className="h-8 w-8 text-black" />
            </div>
            <h3 className="text-2xl font-bold text-amber-200 mb-4">Showroom</h3>
            <p className="text-gray-400 mb-6">
              นัดหมายล่วงหน้าเพื่อดูสินค้าจริง
            </p>
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-3 px-6 rounded-full">
              Gaysorn Village, Bangkok
            </div>
          </div>
        </div>
      </div>
    </div>
  </Section>
);

const Service = () => {
  const services = [
    {
      title: "Buy Sell Trade",
      img: "/our-service1.png",
    },
    {
      title: "Polishing & Servicing",
      img: "/our-service2.png",
    },
    {
      title: "Protection Film",
      img: "/our-service3.png",
    },
  ];

  return (
    <div className="max-w-full mx-auto py-12 mt-10 mb-6 cursor-pointer">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-light text-[#B79B76] mb-4 font-olds">
          Our Service
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

export default async function HomePage() {
  
  const supabase = await createClient();

  // วิธีที่แน่นอนที่สุด - bypass type checking ทั้งหมด
  const query = supabase
    .from("watches")
    .select(
      "id, ref, brand, model, watch_year, product_type, set_type, selling_price, currency, status, watch_media(*), images_url, video_url, is_public, created_at"
    )
    .neq("status", "Sold" as string)
    .order("created_at", { ascending: false })
    .limit(50);

  // เพิ่ม condition แยกเพื่อหลีกเลี่ยง type error
  (query as unknown as { eq: (col: string, val: boolean) => void }).eq(
    "is_public",
    true
  );

  const { data, error } = await query;

  if (error) {
    console.error("Homepage fetch error:", error.message);
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <HeroSection />
        <div className="text-center py-20">
          <div className="max-w-md mx-auto bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8 rounded-2xl border border-red-500/30">
            <div className="text-red-400 text-6xl mb-4">⚠</div>
            <h3 className="text-xl text-amber-200 font-bold mb-4">
              Service Temporarily Unavailable
            </h3>
            <p className="text-gray-400">
              Please contact us directly for assistance
            </p>
          </div>
        </div>
        <AboutSection />
        <TestimonialsSection />
        <ContactSection />
      </div>
    );
  }

  // Map media ให้เหมาะสม โดยรวมข้อมูลจากทั้ง watch_media และ fields เก่า
  const watches: Watch[] = Array.isArray(data)
    ? data.map((watch: unknown) => {
        if (typeof watch !== "object" || watch === null)
          return {
            id: 0,
            ref: "",
            brand: "",
            model: null,
            watch_year: null,
            serial_no: null,
            product_type: null,
            set_type: null,
            size_mm: null,
            material: null,
            cost_price: null,
            selling_price: null,
            currency: "THB",
            status: "Available",
            is_public: false,
            notes: null,
            supplier_id: null,
            created_at: "",
            updated_at: "",
            view_count: 0,
            media: [],
            ownership_type: "stock",
            commission_rate: null,
            commission_amount: null,
            owner_name: null,
            owner_contact: null,
            profit: 0,
            margin_percent: 0,
            profit_status: "unknown",
          };
        const w = watch as Record<string, unknown>;
        // ดึงข้อมูลจาก watch_media table ใหม่
        const newMedia = Array.isArray(w?.watch_media)
          ? [...(w.watch_media as WatchMedia[])].sort(
              (a, b) => (a.position ?? 0) - (b.position ?? 0)
            )
          : [];

        // ดึงข้อมูลจาก fields เก่า (images_url, video_url)
        const legacyMedia: WatchMedia[] = [];

        // เพิ่ม images จาก images_url (ถ้ามี)
        if (Array.isArray(w.images_url)) {
          (w.images_url as string[]).forEach((url: string, index: number) => {
            legacyMedia.push({
              id: index,
              watch_id: typeof w.id === "number" ? w.id : 0,
              url: typeof url === "string" ? url : "",
              type: "image",
              position: index,
              created_at: typeof w.created_at === "string" ? w.created_at : "",
            });
          });
        }

        // เพิ่ม video จาก video_url (ถ้ามี)
        if (typeof w.video_url === "string" && w.video_url) {
          legacyMedia.push({
            id: Array.isArray(w.images_url) ? w.images_url.length : 0,
            watch_id: typeof w.id === "number" ? w.id : 0,
            url: w.video_url,
            type: "video",
            position: legacyMedia.length,
            created_at: typeof w.created_at === "string" ? w.created_at : "",
          });
        }

        // รวมข้อมูลใหม่และเก่า โดยให้ข้อมูลใหม่มาก่อน
        const combinedMedia: WatchMedia[] = [...newMedia, ...legacyMedia];

        return {
          id: typeof w.id === "number" ? w.id : 0,
          ref: typeof w.ref === "string" ? w.ref : "",
          brand: typeof w.brand === "string" ? w.brand : "",
          model: typeof w.model === "string" ? w.model : null,
          watch_year: typeof w.watch_year === "number" ? w.watch_year : null,
          serial_no: typeof w.serial_no === "string" ? w.serial_no : null,
          product_type:
            typeof w.product_type === "string"
              ? (w.product_type as Watch["product_type"])
              : null,
          set_type:
            typeof w.set_type === "object" && w.set_type !== null
              ? (w.set_type as Watch["set_type"])
              : null,
          size_mm: typeof w.size_mm === "number" ? w.size_mm : null,
          material: typeof w.material === "string" ? w.material : null,
          cost_price: typeof w.cost_price === "number" ? w.cost_price : null,
          selling_price:
            typeof w.selling_price === "number" ? w.selling_price : null,
          currency:
            typeof w.currency === "string"
              ? (w.currency as Watch["currency"])
              : "THB",
          status:
            typeof w.status === "string"
              ? (w.status as Watch["status"])
              : "Available",
          is_public: typeof w.is_public === "boolean" ? w.is_public : false,
          notes: typeof w.notes === "string" ? w.notes : null,
          supplier_id: typeof w.supplier_id === "number" ? w.supplier_id : null,
          created_at: typeof w.created_at === "string" ? w.created_at : "",
          updated_at: typeof w.updated_at === "string" ? w.updated_at : "",
          view_count: typeof w.view_count === "number" ? w.view_count : 0,
          media: combinedMedia,
          ownership_type:
            typeof w.ownership_type === "string"
              ? (w.ownership_type as Watch["ownership_type"])
              : "stock",
          commission_rate:
            typeof w.commission_rate === "number" ? w.commission_rate : null,
          commission_amount:
            typeof w.commission_amount === "number"
              ? w.commission_amount
              : null,
          owner_name: typeof w.owner_name === "string" ? w.owner_name : null,
          owner_contact:
            typeof w.owner_contact === "string" ? w.owner_contact : null,
          profit: typeof w.profit === "number" ? w.profit : 0,
          margin_percent:
            typeof w.margin_percent === "number" ? w.margin_percent : 0,
          profit_status:
            typeof w.profit_status === "string"
              ? (w.profit_status as Watch["profit_status"])
              : "unknown",
        };
      })
    : [];

  return (
    <div className="min-h-screen">
      <Header watches={watches} />
      <HeroSection />
      <NewArrival />
      <BrandFilter />
      <WatchProductPage />
      
      {/* <Suspense
        fallback={
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 mx-auto border-4 border-amber-200 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-amber-500/30 rounded-full animate-pulse"></div>
              </div>
              <p className="text-amber-200 font-semibold text-xl tracking-wide ">
                Loading Exclusive Collection...
              </p>
            </div>
          </div>
        }
      >
        <InventorySection initialWatches={watches} />
      </Suspense> */}
      <AboutSection />
      <Service />
      <TestimonialsSection />
      <FAQSection />
      <StickyBanner />
      {/* <ContactSection /> */}
    </div>
  );
}
