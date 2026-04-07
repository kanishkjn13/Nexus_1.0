import { Zap, Target, Users, Shield, Cpu, Globe, Rocket } from 'lucide-react';

export function AboutView() {
  const features = [
    {
      icon: Cpu,
      title: "AI-Powered Learning",
      desc: "Our advanced AI models adapt to your learning pace, providing personalized content and real-time guidance."
    },
    {
      icon: Target,
      title: "Gamified Challenges",
      desc: "Stay motivated with daily streaks, level-ups, and competitive challenges designed to push your limits."
    },
    {
      icon: Users,
      title: "Global Community",
      desc: "Connect with thousands of students worldwide. share knowledge, and collaborate on complex problems."
    },
    {
      icon: Shield,
      title: "Verified Excellence",
      desc: "All content is vetted by industry experts, ensuring you learn only the highest quality technical standards."
    }
  ];

  return (
    <div className="max-w-[1200px] mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Section */}
      <div className="bg-white/40 dark:bg-[#2B124C]/40 backdrop-blur-xl rounded-[40px] border border-white/60 dark:border-white/10 shadow-sm p-12 mb-8 relative overflow-hidden text-center">
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-cyan-200/20 dark:bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-purple-200/20 dark:bg-[#854F6C]/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-[#522B5B] to-[#854F6C] shadow-xl shadow-purple-500/20 flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-[#FBE4D8]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#362A4A] dark:text-[#FBE4D8] mb-6 leading-tight">
            Redefining the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#522B5B] to-[#854F6C]">Education</span> Experience
          </h1>
          <p className="text-lg text-[#362A4A]/70 dark:text-[#DFB6B2]/70 font-bold leading-relaxed mb-8">
            Proofly is more than just a learning platform. It's a next-generation ecosystem built for the modern student who values speed, precision, and community.
          </p>
          <div className="flex justify-center gap-4">
            <div className="px-6 py-2 rounded-full bg-white/20 dark:bg-white/5 border border-white/10 text-sm font-black text-[#522B5B] dark:text-[#FBE4D8] flex items-center gap-2">
              <Globe className="w-4 h-4" /> 200k+ Active Users
            </div>
            <div className="px-6 py-2 rounded-full bg-white/20 dark:bg-white/5 border border-white/10 text-sm font-black text-[#522B5B] dark:text-[#FBE4D8] flex items-center gap-2">
              <Rocket className="w-4 h-4" /> Est. 2024
            </div>
          </div>
        </div>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {features.map((f, i) => (
          <div key={i} className="bg-white/40 dark:bg-[#2B124C]/40 backdrop-blur-xl rounded-[32px] border border-white/60 dark:border-white/10 p-8 hover:scale-[1.02] transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-white/50 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
              <f.icon className="w-6 h-6 text-[#854F6C]" />
            </div>
            <h3 className="text-xl font-black text-[#362A4A] dark:text-[#FBE4D8] mb-3">{f.title}</h3>
            <p className="text-[15px] text-[#362A4A]/60 dark:text-[#DFB6B2]/60 font-bold leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Mission Statement */}
      <div className="bg-gradient-to-br from-[#190019] via-[#2B124C] to-[#522B5B] dark:from-[#2B124C] dark:via-[#190019] dark:to-[#000000] rounded-[40px] p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#DFB6B2_1px,_transparent_1px)]" style={{ backgroundSize: '16px 16px' }} />
        <h2 className="relative z-10 text-2xl md:text-3xl font-black text-[#FBE4D8] mb-6">Our Mission</h2>
        <p className="relative z-10 text-lg text-[#DFB6B2]/80 font-bold max-w-3xl mx-auto leading-relaxed">
          To democratize high-quality technical education by bridging the gap between theoretical knowledge and practical mastery through advanced technology and collaborative learning.
        </p>
      </div>
    </div>
  );
}
