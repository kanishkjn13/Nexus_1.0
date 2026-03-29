import { useState, useEffect } from 'react';
import { Settings, Bell, Shield, Moon, Sun, HelpCircle, Globe, ChevronRight, CheckCircle2, Circle, Zap, CreditCard, UserMinus } from 'lucide-react';
import { useTheme } from 'next-themes';

export function SettingsView() {
  const [activeTab, setActiveTab] = useState('general');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
    { id: 'billing', label: 'Subscription', icon: CreditCard },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ];

  if (!mounted) return null;

  return (
    <div className="max-w-[1200px] mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="mb-8 pl-2">
        <h1 className="text-4xl font-black text-[#362A4A] dark:text-[#FBE4D8] mb-2">Settings</h1>
        <p className="text-[#DFB6B2]/60 font-bold text-[16px]">Manage your account preferences and application settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Nav */}
        <div className="lg:col-span-3">
          <div className="bg-white/40 dark:bg-[#2B124C]/40 backdrop-blur-xl rounded-[28px] border border-white/60 dark:border-white/10 p-4 flex flex-col gap-2 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-[15px] transition-all ${isActive ? 'bg-[#522B5B]/30 text-[#FBE4D8] shadow-sm' : 'text-[#DFB6B2]/50 hover:bg-white/5 hover:text-[#FBE4D8]'}`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#FBE4D8]' : 'text-inherit'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6 bg-gradient-to-br from-[#522B5B] to-[#854F6C] rounded-[28px] p-6 text-white shadow-lg relative overflow-hidden group">
             <Zap className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 group-hover:rotate-12 transition-transform duration-700" />
             <h4 className="font-black text-lg mb-2 relative z-10">Pro Plan</h4>
             <p className="text-white/70 text-xs font-bold leading-relaxed mb-4 relative z-10">Get unlimited AI assistance and offline course access.</p>
             <button className="w-full py-2.5 bg-white text-[#522B5B] rounded-xl font-black text-xs hover:bg-[#FBE4D8] transition-colors relative z-10">Upgrade Now</button>
          </div>
        </div>

        {/* Content Section */}
        <div className="lg:col-span-9 bg-white/40 dark:bg-[#2B124C]/40 backdrop-blur-xl rounded-[32px] border border-white/60 dark:border-white/10 p-10 shadow-sm relative overflow-hidden min-h-[600px]">
          
          {activeTab === 'general' && (
            <div className="flex flex-col gap-8 animate-in fade-in duration-500">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-black text-[#362A4A] dark:text-[#FBE4D8]">General Settings</h3>
                <p className="text-gray-400 dark:text-[#DFB6B2]/40 font-bold text-[13px] uppercase tracking-wider">Appearance and regional preferences</p>
              </div>

              <div className="flex flex-col gap-6">
                {/* Theme Toggle */}
                <div className="flex items-center justify-between p-6 bg-white/40 dark:bg-black/20 rounded-[24px] border border-white/40 dark:border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      {theme === 'dark' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="font-black text-[#362A4A] dark:text-[#FBE4D8]">Appearance</h4>
                      <p className="text-xs font-bold text-gray-400 dark:text-[#DFB6B2]/40">Switch between light and dark mode</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="px-6 py-2.5 rounded-xl bg-[#522B5B] text-white font-black text-xs hover:bg-[#854F6C] transition-colors shadow-lg shadow-purple-900/20"
                  >
                    Toggle {theme === 'dark' ? 'Light' : 'Dark'}
                  </button>
                </div>

                {/* Language Select */}
                <div className="flex items-center justify-between p-6 bg-white/40 dark:bg-black/20 rounded-[24px] border border-white/40 dark:border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-500/10 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                      <Globe className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-[#362A4A] dark:text-[#FBE4D8]">Language</h4>
                      <p className="text-xs font-bold text-gray-400 dark:text-[#DFB6B2]/40">Select your preferred language</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 dark:bg-white/5 px-4 py-2 rounded-xl border border-white/20 cursor-pointer">
                    <span className="text-sm font-bold text-[#362A4A] dark:text-[#FBE4D8]">English (US)</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Help Section Button */}
                <div className="flex items-center justify-between p-6 bg-white/40 dark:bg-black/20 rounded-[24px] border border-white/40 dark:border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-[#362A4A] dark:text-[#FBE4D8]">Support Center</h4>
                      <p className="text-xs font-bold text-gray-400 dark:text-[#DFB6B2]/40">Need help? Visit our support documentation</p>
                    </div>
                  </div>
                  <button className="px-6 py-2.5 rounded-xl border-2 border-[#522B5B] text-[#522B5B] dark:text-[#FBE4D8] dark:border-[#DFB6B2]/20 font-black text-xs hover:bg-[#522B5B] hover:text-white dark:hover:bg-white/5 transition-all">
                    Open Help
                  </button>
                </div>
              </div>

              <div className="pt-8 border-t border-black/5 dark:border-white/5">
                <button className="flex items-center gap-3 text-red-500/60 hover:text-red-500 font-black text-sm transition-colors group">
                  <UserMinus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Deactivate Account
                </button>
              </div>
            </div>
          )}

          {activeTab !== 'general' && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
               <div className="w-24 h-24 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-6">
                 <Settings className="w-10 h-10 text-[#DFB6B2]/20 animate-spin-slow" />
               </div>
               <h4 className="text-2xl font-black text-[#362A4A] dark:text-[#FBE4D8] mb-2">{tabs.find(t => t.id === activeTab)?.label}</h4>
               <p className="text-[#DFB6B2]/60 font-bold max-w-sm">We're updating the {activeTab} settings to provide more control over your experience.</p>
               <button onClick={() => setActiveTab('general')} className="mt-6 text-[#522B5B] dark:text-[#DFB6B2] font-black text-sm hover:underline">Return to General Settings</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
