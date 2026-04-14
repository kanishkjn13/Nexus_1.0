import React from "react";
import { Zap, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 w-full border-t border-black/5 dark:border-white/5 pt-12 pb-8 px-4 text-[#362A4A] dark:text-[#FBE4D8]">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

        {/* Brand Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#522B5B] to-[#854F6C] shadow-lg shadow-purple-900/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#FBE4D8] z-10" />
            </div>
            <span className="text-[#362A4A] dark:text-[#FBE4D8] font-black text-[22px] tracking-tight">Proofly.</span>
          </div>
          <p className="text-[#522B5B]/60 dark:text-[#DFB6B2]/60 font-semibold text-[15px] leading-relaxed max-w-[300px]">
            The next-generation learning platform designed to help you reach your full potential through community-driven education.
          </p>
          <div className="flex gap-4 items-center">
            {[Github, Twitter, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 flex items-center justify-center hover:scale-110 hover:bg-purple-100 dark:hover:bg-[#2B124C] transition-all group">
                <Icon className="w-5 h-5 text-[#522B5B]/40 dark:text-[#DFB6B2]/50 group-hover:text-purple-400 dark:group-hover:text-[#FBE4D8]" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-6">
          <h4 className="text-[16px] font-black uppercase tracking-widest text-[#522B5B]/50 dark:text-[#DFB6B2]/40">Explore</h4>
          <ul className="flex flex-col gap-4 font-bold text-[15px]">
            {['Home', 'Challenges', 'Courses', 'Community'].map((link) => (
              <li key={link}>
                <a href="#" className="text-[#522B5B]/60 dark:text-[#DFB6B2]/60 hover:text-purple-400 dark:hover:text-[#FBE4D8] transition-colors">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div className="flex flex-col gap-6">
          <h4 className="text-[16px] font-black uppercase tracking-widest text-[#522B5B]/50 dark:text-[#DFB6B2]/40">Resources</h4>
          <ul className="flex flex-col gap-4 font-bold text-[15px]">
            {['Help Center', 'Partners', 'Terms of Service', 'Privacy Policy'].map((link) => (
              <li key={link}>
                <a href="#" className="text-[#522B5B]/60 dark:text-[#DFB6B2]/60 hover:text-purple-400 dark:hover:text-[#FBE4D8] transition-colors">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter Section */}
        <div className="flex flex-col gap-6">
          <h4 className="text-[16px] font-black uppercase tracking-widest text-[#522B5B]/50 dark:text-[#DFB6B2]/40">Stay Updated</h4>
          <p className="text-[#522B5B]/60 dark:text-[#DFB6B2]/60 font-semibold text-[15px]">
            Subscribe to our newsletter for the latest updates and learning tips.
          </p>
          <div className="relative group">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full h-12 rounded-full px-6 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-[#522B5B] text-[#362A4A] dark:text-[#FBE4D8] placeholder:text-[#362A4A]/30 dark:placeholder:text-[#DFB6B2]/30 font-bold text-[14px] transition-all"
            />
            <button className="absolute right-1 top-1 bottom-1 px-4 rounded-full bg-gradient-to-r from-[#522B5B] to-[#854F6C] text-[#FBE4D8] font-black text-[13px] shadow-lg hover:scale-[0.98] transition-transform">
              Send
            </button>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1400px] mx-auto pt-8 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-[14px] font-bold text-[#522B5B]/40 dark:text-[#DFB6B2]/40 flex items-center gap-2">
          Empowering the next generation of global learners.
        </p>
        <p className="text-[14px] font-bold text-[#522B5B]/40 dark:text-[#DFB6B2]/40">
          © {currentYear} Proofly. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
