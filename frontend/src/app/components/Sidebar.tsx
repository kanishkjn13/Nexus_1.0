import { Home, Trophy, Target, Sparkles, User, Settings, LogOut, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'challenges', icon: Trophy, label: 'Challenges' },
  { id: 'progress', icon: Target, label: 'Progress' },
  { id: 'ai', icon: Sparkles, label: 'Proofly AI' },
  { id: 'profile', icon: User, label: 'About Me' }
];

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export function Sidebar({ activeView, onNavigate, onLogout }: SidebarProps) {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-[240px] fixed left-0 top-0 h-screen flex flex-col items-center py-6 bg-transparent z-50">
      <div className="bg-gradient-to-br from-white/90 via-[#FBE4D8]/80 to-[#DFB6B2]/70 dark:bg-none dark:bg-[#190019] rounded-[32px] w-[200px] h-[calc(100vh-48px)] flex flex-col py-8 justify-between shadow-2xl shadow-black/10 dark:shadow-black/60 border border-white/60 dark:border-white/5 transition-all duration-500 backdrop-blur-xl overflow-y-auto no-scrollbar">

        
        {/* Top Section */}
        <div className="flex flex-col gap-2 w-full px-4">
          {/* Logo Mark */}
          <div className="flex items-center gap-3 mb-8 px-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-cyan-200 to-blue-300 shadow-lg shadow-cyan-900/40 flex items-center justify-center group-hover:rotate-12 transition-transform">
               <Zap className="w-6 h-6 text-blue-900 z-10" />
            </div>
            <span className="text-[#FBE4D8] font-black text-[22px] tracking-tight group-hover:text-cyan-300 transition-colors">Proofly.</span>
          </div>
          
          {/* Nav Items */}
          {navItems.map(({ id, icon: Icon, label }) => {
            const isActive = activeView === id;
            return (
              <div 
                key={id} 
                onClick={() => onNavigate(id)}
                className={`w-full flex items-center gap-4 text-[#FBE4D8] hover:text-[#FBE4D8] transition-all cursor-pointer relative py-3 px-3 rounded-[12px] group overflow-hidden ${isActive ? 'bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.03)]' : 'text-[#DFB6B2]/50'}`}
              >
                {isActive && (
                  <div className="absolute left-[-2px] w-1 h-6 bg-cyan-300 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                )}
                <Icon className={`w-[20px] h-[20px] z-10 group-hover:scale-110 transition-transform ${isActive ? 'text-cyan-300' : 'text-inherit'}`} />
                <span className={`z-10 font-black text-[15px] ${isActive ? 'text-[#FBE4D8]' : 'text-inherit'}`}>{label}</span>
              </div>
            );
          })}
        </div>
        
        {/* Bottom Section */}
        <div className="flex flex-col gap-4 w-full px-6 border-t border-white/5 pt-6">

          <div 
            onClick={() => onNavigate('settings')}
            className={`w-full flex items-center gap-4 text-[#DFB6B2]/50 hover:text-[#FBE4D8] transition-colors cursor-pointer py-2 ${activeView === 'settings' ? 'text-[#FBE4D8]' : ''}`}
          >
            <Settings className="w-[20px] h-[20px]" />
            <span className="font-semibold text-[15px]">Settings</span>
          </div>
          <div 
            onClick={onLogout}
            className="w-full flex items-center gap-4 text-[#854F6C]/70 hover:text-[#854F6C] transition-colors cursor-pointer py-2 group"
          >
            <LogOut className="w-[20px] h-[20px] group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold text-[15px]">Log Out</span>
          </div>
        </div>
      </div>
    </div>
  );
}
