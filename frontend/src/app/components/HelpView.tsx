import { HelpCircle, MessageCircle, FileText, ExternalLink, Mail, Phone, Globe, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';

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

export function HelpView() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-[1200px] mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      {/* Header / Hero */}
      <div className="bg-white/40 dark:bg-[#2B124C]/40 backdrop-blur-xl rounded-[40px] border border-white/60 dark:border-white/10 p-12 mb-8 relative overflow-hidden text-center">
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-purple-200/20 dark:bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-pink-200/20 dark:bg-pink-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#522B5B] to-[#854F6C] shadow-xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-[#362A4A] dark:text-[#FBE4D8] mb-4">How can we help you?</h1>
          <p className="text-[#362A4A]/60 dark:text-[#DFB6B2]/60 font-bold mb-8">Search our knowledge base or get in touch with our team.</p>
          
          <div className="relative group max-w-lg mx-auto">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-[#522B5B]/30 dark:text-white/30" />
            </div>
            <input 
              type="text"
              placeholder="Search for articles, guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-14 pr-6 rounded-2xl bg-white/60 dark:bg-black/20 border border-white/10 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-[#854F6C] font-bold text-[#362A4A] dark:text-white transition-all shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Support Channels */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/40 dark:bg-[#2B124C]/40 backdrop-blur-xl rounded-[32px] border border-white/60 dark:border-white/10 p-8">
            <h3 className="text-xl font-black text-[#362A4A] dark:text-[#FBE4D8] mb-6">Contact Support</h3>
            <div className="space-y-4">
              <a href="#" className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-white dark:border-white/5 hover:scale-[1.02] transition-all group">
                 <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                   <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                 </div>
                 <div className="flex-1">
                   <div className="text-xs font-black text-[#522B5B]/40 dark:text-white/30 uppercase tracking-widest">Email Us</div>
                   <div className="text-[14px] font-black text-[#362A4A] dark:text-[#FBE4D8]">support@proofly.ai</div>
                 </div>
              </a>
              <a href="#" className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-white dark:border-white/5 hover:scale-[1.02] transition-all group">
                 <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                   <MessageCircle className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                 </div>
                 <div className="flex-1">
                   <div className="text-xs font-black text-[#522B5B]/40 dark:text-white/30 uppercase tracking-widest">Live Chat</div>
                   <div className="text-[14px] font-black text-[#362A4A] dark:text-[#FBE4D8]">Average response: 2m</div>
                 </div>
              </a>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                 <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center shadow-lg">
                   <Globe className="w-5 h-5 text-white" />
                 </div>
                 <div className="flex-1">
                   <div className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">System Status</div>
                   <div className="text-[14px] font-black text-[#362A4A] dark:text-[#FBE4D8]">All Systems Operational</div>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#190019] to-[#2B124C] rounded-[32px] p-8 text-center relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#DFB6B2_1px,_transparent_1px)]" style={{ backgroundSize: '16px 16px' }} />
             <h4 className="text-lg font-black text-white mb-2 relative z-10">Quick Tip 💡</h4>
             <p className="text-sm text-purple-200/80 font-bold leading-relaxed relative z-10">
               Use the command line in Proofly AI to quickly access documentation and subject guides.
             </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="lg:col-span-2 bg-white/40 dark:bg-[#2B124C]/40 backdrop-blur-xl rounded-[32px] border border-white/60 dark:border-white/10 p-10">
          <h3 className="text-2xl font-black text-[#362A4A] dark:text-[#FBE4D8] mb-8 flex items-center gap-3">
             <FileText className="w-6 h-6 text-[#854F6C]" />
             Frequently Asked Questions
          </h3>
          
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <details key={i} className="group overflow-hidden rounded-2xl border border-white/20 dark:border-white/5 bg-white/30 dark:bg-white/5 transition-all outline-none">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none outline-none">
                   <h4 className="text-[15px] font-black text-[#362A4A] dark:text-[#FBE4D8] leading-relaxed pr-4">{faq.q}</h4>
                   <ChevronRight className="w-5 h-5 text-[#854F6C] transition-transform duration-300 group-open:rotate-90" />
                </summary>
                <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2 duration-300">
                  <p className="text-[14px] text-[#362A4A]/70 dark:text-[#DFB6B2]/70 font-bold leading-relaxed border-t border-black/5 dark:border-white/5 pt-4">
                    {faq.a}
                  </p>
                </div>
              </details>
            ))}
          </div>

          <button className="w-full mt-12 py-4 rounded-2xl bg-white/50 dark:bg-black/20 border border-dashed border-[#854F6C]/40 text-[#854F6C] dark:text-[#DFB6B2] font-black text-sm uppercase tracking-widest hover:bg-[#854F6C]/10 transition-all flex items-center justify-center gap-2">
            View Knowledge Base <ExternalLink size={14} />
          </button>
        </div>
      </div>

    </div>
  );
}
