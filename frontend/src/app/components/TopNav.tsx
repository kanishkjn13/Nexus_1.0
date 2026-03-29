import { Bell, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const MOCK_NOTIFICATIONS = [
  { id: 1, title: 'Challenge Completed', desc: 'You earned +20 XP in Logic Puzzles!', time: '2m ago' },
  { id: 2, title: 'New Course Available', desc: 'Advanced Algebra is now open.', time: '1h ago' },
  { id: 3, title: 'Streak Milestone', desc: '7 days in a row! Keep it up.', time: '5h ago' }
];

interface User {
  name: string;
  email: string;
}

interface TopNavProps {
  onSearch: (query: string) => void;
  user: User;
  onProfileClick: () => void;
}

export function TopNav({ onSearch, user, onProfileClick }: TopNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = document.querySelector<HTMLElement>('.main-scroll');
    if (!scroller) return;
    const onScroll = () => setScrolled(scroller.scrollTop > 10);
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };

  return (
    <nav className={`flex justify-between items-center px-10 py-5 sticky top-0 z-40 hidden lg:flex transition-all duration-300 ease-out ${scrolled ? 'bg-white/70 dark:bg-[#190019]/80 backdrop-blur-xl border-b border-white/50 dark:border-white/5 shadow-sm' : 'bg-transparent'}`}>
      <div className="flex items-center gap-6 flex-1">
        <label className="flex items-center bg-white/40 dark:bg-[#2B124C]/40 backdrop-blur-md rounded-full px-5 py-2.5 border border-white/60 dark:border-white/10 shadow-sm focus-within:ring-2 focus-within:ring-purple-300 dark:focus-within:ring-[#522B5B] w-[320px] transition-all">
          <Search className="w-5 h-5 text-gray-400 dark:text-[#DFB6B2]/50 mr-3 shrink-0" />
          <input type="text" placeholder="Search students, challenges..." value={searchValue} onChange={handleChange} className="bg-transparent focus:outline-none placeholder:text-gray-400 dark:placeholder:text-[#DFB6B2]/30 text-[#362A4A] dark:text-[#FBE4D8] w-full text-[15px] font-medium" />
        </label>
      </div>

      <div className="flex items-center gap-5 relative">
        <div className="relative">
          <div onClick={() => {setShowNotifications(!showNotifications); setUnreadCount(0);}} className="bg-white/40 dark:bg-[#2B124C]/40 backdrop-blur-md p-3 rounded-full border border-white/60 dark:border-white/10 shadow-sm transition-all hover:scale-105 cursor-pointer">
            <Bell className="w-5 h-5 text-[#362A4A] dark:text-[#FBE4D8]" />
          </div>
          {unreadCount > 0 && <span className="absolute top-0 right-0 w-[11px] h-[11px] bg-[#854F6C] rounded-full border-[2px] border-white dark:border-[#190019] translate-x-[2px] translate-y-[2px] animate-pulse" />}
          
          {showNotifications && (
            <div ref={popoverRef} className="absolute right-0 mt-4 w-80 bg-white/95 dark:bg-[#2B124C]/95 backdrop-blur-2xl rounded-[24px] shadow-2xl border border-white/20 dark:border-white/5 p-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-[16px] font-black text-[#362A4A] dark:text-[#FBE4D8]">Notifications</h4>
                <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
              </div>
              <div className="flex flex-col gap-4">
                {MOCK_NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="group cursor-pointer">
                    <h5 className="text-[14px] font-extrabold text-[#362A4A] dark:text-[#FBE4D8] group-hover:text-purple-400 transition-colors">{n.title}</h5>
                    <p className="text-[12px] text-gray-500 dark:text-[#DFB6B2]/60 font-medium leading-snug">{n.desc}</p>
                    <span className="text-[10px] text-gray-400 dark:text-[#DFB6B2]/40 font-bold uppercase tracking-widest mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 rounded-xl bg-purple-100 dark:bg-white/5 text-purple-900 dark:text-[#FBE4D8] text-[13px] font-black hover:bg-purple-200 dark:hover:bg-white/10 transition-colors">Mark all as read</button>
            </div>
          )}
        </div>

        <div 
          onClick={onProfileClick}
          className="flex items-center gap-3 cursor-pointer hover:bg-white/20 dark:hover:bg-white/5 p-2 pr-4 rounded-full transition-all border border-transparent hover:border-white/40 dark:hover:border-white/10"
        >
          <img src="https://i.pravatar.cc/150?img=1" alt={user.name} className="w-[40px] h-[40px] rounded-full object-cover border-[2px] border-white dark:border-[#2B124C] shadow-sm" />
          <div className="flex flex-col leading-tight">
            <span className="font-extrabold text-[14px] text-[#362A4A] dark:text-[#FBE4D8]">{user.name}</span>
            <span className="text-[11px] text-gray-500 dark:text-[#DFB6B2]/60 font-semibold tracking-wide uppercase">Premium Student</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
