import { useState, useEffect } from 'react';
import { Settings, Bell, Shield, Moon, Sun, HelpCircle, CheckCircle2, Circle, Zap, CreditCard, UserMinus, MessageCircle, FileText, ExternalLink, Mail, Phone, Globe, ChevronRight, Search } from 'lucide-react';
import { useTheme } from 'next-themes';

const FAQS = [
  {
    q: "How do I sync my progress across devices?",
    a: "Your progress is automatically synced with your account. Just sign in on any device to pick up where you left off."
  },
  {
    q: "Can I use Proofly AI for all subjects?",
    a: "Proofly AI is optimized for technical, scientific, and academic subjects, including Mathematics, Coding, Physics, and Business Theory."
  },
  {
    q: "Is there a limit on AI queries?",
    a: "Free accounts have a generous daily limit. For unlimited access and advanced reasoning models, consider checking our Pro section."
  },
  {
    q: "How do I redeem my streak rewards?",
    a: "Rewards are automatically credited to your XP balance. Exclusive badges can be viewed in your Progress dashboard."
  }
];

export function SettingsView() {
  const [activeTab, setActiveTab] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ];

  if (!mounted) return null;

  return (
    <div className="max-w-[1200px] mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="mb-8 pl-2">
        <h1 className="text-4xl font-black text-[#362A4A] dark:text-[#FBE4D8] mb-2">Settings</h1>
        <p className="text-[#362A4A]/60 dark:text-[#DFB6B2]/60 font-bold text-[16px]">Manage your account preferences and application settings.</p>
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
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-[15px] transition-all ${isActive ? 'bg-[#522B5B]/30 text-[#362A4A] dark:text-[#FBE4D8] shadow-sm' : 'text-[#362A4A]/50 dark:text-[#DFB6B2]/50 hover:bg-white/5 dark:hover:text-[#FBE4D8]'}`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#362A4A] dark:text-[#FBE4D8]' : 'text-inherit'}`} />
                  {tab.label}
                </button>
              );
            })}
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
                      <p className="text-xs font-bold text-[#362A4A]/50 dark:text-[#DFB6B2]/50">Switch between light and dark mode</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="px-6 py-2.5 rounded-xl bg-[#522B5B] text-white font-black text-xs hover:bg-[#854F6C] transition-colors shadow-lg shadow-purple-900/20"
                  >
                    Toggle {theme === 'dark' ? 'Light' : 'Dark'}
                  </button>
                </div>



                {/* Help Section Button */}
                <div className="flex items-center justify-between p-6 bg-white/40 dark:bg-black/20 rounded-[24px] border border-white/40 dark:border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                      <HelpCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-[#362A4A] dark:text-[#FBE4D8]">Support Center</h4>
                      <p className="text-xs font-bold text-[#362A4A]/50 dark:text-[#DFB6B2]/50">Need help? Visit our support documentation</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('help')}
                    className="px-6 py-2.5 rounded-xl border-2 border-[#522B5B] text-[#522B5B] dark:text-[#FBE4D8] dark:border-[#DFB6B2]/20 font-black text-xs hover:bg-[#522B5B] hover:text-white dark:hover:bg-white/5 transition-all"
                  >
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

          {activeTab === 'help' && (
            <div className="flex flex-col gap-8 animate-in fade-in duration-500">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-black text-[#362A4A] dark:text-[#FBE4D8]">Help & Support</h3>
                <p className="text-gray-400 dark:text-[#DFB6B2]/40 font-bold text-[13px] uppercase tracking-wider">FAQs and support channels</p>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-[#522B5B]/30 dark:text-white/30" />
                </div>
                <input 
                  type="text"
                  placeholder="Search articles, guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white/40 dark:bg-black/20 border border-white/40 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-[#854F6C] font-bold text-[#362A4A] dark:text-white transition-all shadow-md"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href="#" className="flex items-center gap-4 p-5 rounded-[24px] bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 hover:scale-[1.02] transition-all group">
                   <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                     <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                   </div>
                   <div className="flex-1">
                     <div className="text-[10px] font-black text-[#522B5B]/50 dark:text-white/30 uppercase tracking-widest">Email Us</div>
                     <div className="text-[15px] font-black text-[#362A4A] dark:text-[#FBE4D8]">support@proofly.ai</div>
                   </div>
                </a>
                <a href="#" className="flex items-center gap-4 p-5 rounded-[24px] bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 hover:scale-[1.02] transition-all group">
                   <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                     <MessageCircle className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                   </div>
                   <div className="flex-1">
                     <div className="text-[10px] font-black text-[#522B5B]/50 dark:text-white/30 uppercase tracking-widest">Live Chat</div>
                     <div className="text-[15px] font-black text-[#362A4A] dark:text-[#FBE4D8]">Average: 2m</div>
                   </div>
                </a>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-black text-[#362A4A] dark:text-[#FBE4D8] mb-2">FAQs</h4>
                {FAQS.map((faq, i) => (
                  <details key={i} className="group overflow-hidden rounded-2xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-white/5 transition-all outline-none">
                    <summary className="flex items-center justify-between p-5 cursor-pointer list-none outline-none">
                       <h4 className="text-[14px] font-black text-[#362A4A] dark:text-[#FBE4D8] leading-relaxed pr-4">{faq.q}</h4>
                       <ChevronRight className="w-5 h-5 text-[#854F6C] transition-transform duration-300 group-open:rotate-90" />
                    </summary>
                    <div className="px-5 pb-5 pt-0 animate-in slide-in-from-top-2 duration-300">
                      <p className="text-[13px] text-[#362A4A]/70 dark:text-[#DFB6B2]/70 font-bold leading-relaxed border-t border-black/5 dark:border-white/5 pt-4">
                        {faq.a}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {activeTab !== 'general' && activeTab !== 'help' && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
               <div className="w-24 h-24 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-6">
                 <Settings className="w-10 h-10 text-[#DFB6B2]/20 animate-spin-slow" />
               </div>
               <h4 className="text-2xl font-black text-[#362A4A] dark:text-[#FBE4D8] mb-2">{tabs.find(t => t.id === activeTab)?.label}</h4>
               <p className="text-[#362A4A]/60 dark:text-[#DFB6B2]/60 font-bold max-w-sm">We're updating the {activeTab} settings to provide more control over your experience.</p>
               <button onClick={() => setActiveTab('general')} className="mt-6 text-[#522B5B] dark:text-[#DFB6B2] font-black text-sm hover:underline">Return to General Settings</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
