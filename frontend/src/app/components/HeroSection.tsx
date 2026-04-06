import { useTheme } from 'next-themes';
// @ts-ignore - TS server caching may temporarily miss the newly created image
import heroImage from '../../assets/active_session_hero.png';
// @ts-ignore
import heroImageDay from '../../assets/active_session_hero_day.png';
import { useEffect, useState } from 'react';
import { ChevronRight } from 'lucide-react';

export function HeroSection() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && theme === 'dark';

  return (
    <div className="relative bg-white/40 dark:bg-[#2B124C]/40 backdrop-blur-md rounded-[32px] py-6 px-10 mb-6 flex items-center justify-between shadow-sm border border-white/60 dark:border-white/10 overflow-hidden transition-all duration-500 group min-h-[200px]">

      {/* FULL Photograph Layer - Blended and Large */}
      <div className="absolute right-0 top-0 bottom-0 w-full h-full pointer-events-none z-0">
        {mounted && (
          <div className="absolute right-0 top-0 w-full h-full transition-transform duration-1000 ease-out group-hover:scale-[1.02]">
            <img
              src={isDark ? heroImage : heroImageDay}
              alt="Hero Artwork Full"
              className="w-full h-full object-contain object-right opacity-100 transition-opacity duration-700"
              style={{
                // Proper blending to fade the image smoothly into the background extending further right
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 40%, black 75%, black 100%)',
                maskImage: 'linear-gradient(to right, transparent 0%, transparent 40%, black 75%, black 100%)'
              }}
            />
            {/* Targeted internal glow to enhance the character depth */}
            <div className="absolute right-[15%] top-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/10 dark:bg-[#522B5B]/20 rounded-full blur-[60px]"></div>
          </div>
        )}
      </div>

      {/* Decorative Accent Orbs */}
      <div className="absolute -left-10 -top-10 w-64 h-64 bg-purple-200/10 dark:bg-[#522B5B]/10 rounded-full blur-3xl z-0"></div>

      {/* Foreground Content - Positioned to complement the large image */}
      <div className="flex-col gap-3 relative z-10 w-full md:w-1/2 py-1 flex items-start">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-300/10 dark:bg-[#FBE4D8]/10 border border-purple-300/20 dark:border-[#FBE4D8]/10 mb-3 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-300 to-pink-300 animate-pulse"></span>
          <span className="text-[10px] font-black text-purple-700 dark:text-[#DFB6B2] uppercase tracking-[0.1em]">Active Session</span>
        </div>

        <h1 className="text-[32px] md:text-[42px] font-black text-[#362A4A] dark:text-[#FBE4D8] tracking-tight leading-[1] mb-2 transition-all duration-300 drop-shadow-sm">
          Welcome back!
        </h1>

        <p className="text-[15px] md:text-[16px] text-[#362A4A]/80 dark:text-[#DFB6B2]/90 font-bold max-w-[400px] leading-snug mb-5 transition-colors duration-300">
          Ready to boost your learning today? <br className="hidden md:block" />
          Keep your momentum and reach your goals.
        </p>

        <button className="bg-gradient-to-r from-[#DAB8FF] via-[#C9A0FF] to-[#DAB8FF] dark:from-[#522B5B] dark:via-[#854F6C] dark:to-[#522B5B] bg-[length:200%_auto] hover:bg-right text-[#362A4A] dark:text-[#FBE4D8] font-extrabold text-[14px] px-8 py-3 rounded-full w-fit shadow-2xl shadow-purple-300/20 dark:shadow-black/60 hover:scale-[0.98] active:scale-[0.95] transition-all duration-500 border border-white/50 dark:border-white/10 inline-flex items-center gap-3">
          Start Test <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Floating Magic Elements */}
      <div className="absolute left-[35%] top-[15%] text-4xl transform -rotate-12 drop-shadow-2xl animate-pulse z-20 select-none">✨</div>
      <div className="absolute right-[4%] bottom-[12%] text-3xl transform rotate-12 opacity-50 animate-bounce transition-all z-20 select-none" style={{ animationDuration: '5s' }}>⭐</div>
    </div>
  );
}
