"use client";
import { FC, ReactNode } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import { Star, Shield, Award, Clock } from "lucide-react";

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

const AboutSection = () => {
  const { t } = useLanguage();
  return (
    <section id="about" className="relative" style={{ maxHeight: "1000px" }}>
      <div className="md:mt-[100px] xl:mt-[150px] h-[900px] relative  pt-[100px] flex flex-col justify-center items-start text-left overflow-hidden">
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
              className="text-5xl md:text-5xl  lg:text-8xl font-light text-[#E0D0B9] mb-4 tracking-wide"
            >
              ABOUT
            </h1>
            <h1
              style={{ marginTop: "-20px" }}
              className="font-olds text-5xl md:text-5xl lg:text-8xl font-light text-[#B79B76] mb-4 tracking-wide"
            >
              CHRONOS WATCH
            </h1>
            <div className="mt-10 md:w-[70%] lg:w-[60%] xl:w-[50%]">
              <p className="text-xl">{t("AboutSection.p1")}</p>
              <p className="mt-8 text-xl">{t("AboutSection.p2")}</p>
            </div>
            <div
              className="mt-10 pb-8 pt-5 px-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              style={{
                backgroundImage: "linear-gradient(to right, #2C2C33, #141519)",
                marginTop: "80px",
              }}
            >
              <FeatureCard
                icon={<Shield className="w-8 h-8 text-white" />}
                title="Authentic"
                description={t("AboutSection.feature1")}
              />
              <FeatureCard
                icon={<Award className="w-8 h-8 text-white" />}
                title="Quality"
                description={t("AboutSection.feature2")}
              />
              <FeatureCard
                icon={<Star className="w-8 h-8 text-white" />}
                title="Exclusive"
                description={t("AboutSection.feature3")}
              />
              <FeatureCard
                icon={<Clock className="w-8 h-8 text-white" />}
                title="Legacy"
                description={t("AboutSection.feature4")}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default AboutSection;
