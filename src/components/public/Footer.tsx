'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Phone, MapPin, Clock, Star, Shield, Award } from 'lucide-react';

const Logo = () => (
  <Link href="/" className="group inline-block">
    <div className="relative">
      <Image
        src="/logo.png"
        alt="Chronos Watch Logo"
        width={200}
        height={60}
        className="h-auto transition-all duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-amber-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
    </div>
  </Link>
);

const SocialLink = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="group relative p-3 rounded-xl border border-amber-500/30 hover:border-amber-400 hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-amber-600/10 transition-all duration-300"
    aria-label={label}
  >
    <div className="text-amber-400 group-hover:text-amber-300 transition-colors duration-300">
      {icon}
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-amber-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
  </a>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link 
    href={href} 
    className="group relative text-gray-400 hover:text-amber-200 transition-all duration-300 text-sm"
  >
    {children}
    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
  </Link>
);

const FeatureItem = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="flex items-start space-x-3 group">
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center group-hover:from-amber-500/30 group-hover:to-amber-600/30 transition-all duration-300">
      <div className="text-amber-400 group-hover:text-amber-300 transition-colors duration-300">
        {icon}
      </div>
    </div>
    <div>
      <h4 className="font-semibold text-amber-200 mb-1">{title}</h4>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

const ContactItem = ({ icon, title, info }: { icon: React.ReactNode; title: string; info: string }) => (
  <div className="flex items-center space-x-3 group hover:bg-gradient-to-r hover:from-amber-500/5 hover:to-amber-600/5 p-3 rounded-lg transition-all duration-300">
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center group-hover:from-amber-500/30 group-hover:to-amber-600/30 transition-all duration-300">
      <div className="text-amber-400 group-hover:text-amber-300 transition-colors duration-300">
        {icon}
      </div>
    </div>
    <div>
      <h4 className="font-semibold text-amber-200 text-sm">{title}</h4>
      <p className="text-gray-400 text-xs">{info}</p>
    </div>
  </div>
);

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 border-t border-amber-500/20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
      
      <div className="relative container mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <Logo />
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
              เราคือผู้เชี่ยวชาญในการคัดสรรนาฬิกาหรูมือสองสภาพเยี่ยมจากทั่วโลก 
              ด้วยความใส่ใจในทุกรายละเอียดเพื่อส่งมอบมรดกแห่งเวลาที่ทรงคุณค่าสู่ข้อมือคุณ
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <SocialLink href="#" icon={<Instagram size={20} />} label="Follow us on Instagram" />
              <SocialLink href="#" icon={<Facebook size={20} />} label="Follow us on Facebook" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-amber-200 mb-4">
              Quick Links
              <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mt-2"></div>
            </h3>
            <div className="space-y-3">
              <FooterLink href="/">Home</FooterLink>
              <FooterLink href="/#inventory">Collection</FooterLink>
              <FooterLink href="/#about">About Us</FooterLink>
              <FooterLink href="/#contact">Contact</FooterLink>
              <FooterLink href="/#testimonials">Reviews</FooterLink>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-amber-200 mb-4">
              Contact Info
              <div className="w-12 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mt-2"></div>
            </h3>
            <div className="space-y-3">
              <ContactItem 
                icon={<Phone size={16} />} 
                title="+66 8x-xxx-xxxx" 
                info="Monday - Sunday, 9AM - 9PM"
              />
              <ContactItem 
                icon={<MapPin size={16} />} 
                title="Gaysorn Village, Bangkok" 
                info="By appointment only"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="border-t border-amber-500/20 pt-12 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureItem
              icon={<Shield size={20} />}
              title="100% Authentic"
              description="Every piece is thoroughly authenticated by certified experts with lifetime guarantee."
            />
            <FeatureItem
              icon={<Award size={20} />}
              title="Premium Quality"
              description="Rigorous inspection ensures each watch meets our highest standards of excellence."
            />
            <FeatureItem
              icon={<Clock size={20} />}
              title="Timeless Value"
              description="Carefully curated pieces that retain and increase their value over time."
            />
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-amber-500/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Chronos Watch. All Rights Reserved.
              </p>
              <div className="flex items-center space-x-2 text-amber-400">
                <Star size={16} className="fill-current" />
                <span className="text-sm font-semibold">Premium Dealer</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <span className="text-gray-600">|</span>
              <FooterLink href="/terms">Terms & Conditions</FooterLink>
              <span className="text-gray-600">|</span>
              <FooterLink href="/warranty">Warranty</FooterLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}