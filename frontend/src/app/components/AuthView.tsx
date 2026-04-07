import { useState } from 'react';
import { Zap, Mail, Lock, User, ArrowRight, ChevronLeft, HelpCircle } from 'lucide-react';

const MOCK_USERS = [
  { email: 'kanishk@example.com', password: 'password123', name: 'Kanishk Jain' },
  { email: 'emma@example.com', password: 'password123', name: 'Emma Roberts' },
  { email: 'test@test.com', password: 'test', name: 'Test User' }
];

interface AuthViewProps {
  onLogin: (user: { name: string; email: string }) => void;
}

export function AuthView({ onLogin }: AuthViewProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    
    // Mock authentication check
    setTimeout(() => {
      setLoading(false);
      
      if (isLogin) {
        const foundUser = MOCK_USERS.find(u => u.email === email);
        
        if (!foundUser) {
          setError('Account not found. Redirecting to sign up...');
          setTimeout(() => {
            setIsLogin(false);
            setName('');
            setError('');
          }, 1500);
          return;
        }

        if (foundUser.password !== password) {
          setError('Wrong Password');
          return;
        }

        onLogin?.({ name: foundUser.name, email: foundUser.email });
      } else {
        // Mock Sign Up
        onLogin?.({ name, email });
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#190019] flex items-center justify-center p-6 overflow-y-auto no-scrollbar">
      {/* Background Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#522B5B]/30 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#854F6C]/20 rounded-full blur-[150px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-white/5 backdrop-blur-3xl rounded-[40px] border border-white/10 shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-700">
        
        {/* Left Section - Hero/Info */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#190019] via-[#2B124C] to-[#522B5B] relative overflow-hidden text-[#FBE4D8]">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#DFB6B2_1.5px,_transparent_2px)]" style={{ backgroundSize: '24px 24px' }} />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#522B5B] to-[#854F6C] shadow-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#FBE4D8]" />
              </div>
              <span className="font-black text-[24px] tracking-tight">Proofly.</span>
            </div>
            <h1 className="text-[48px] font-black leading-[1.1] mb-6 tracking-tight">
              Master your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DFB6B2] to-[#854F6C]">learning</span> journey.
            </h1>
            <p className="text-[18px] text-[#DFB6B2]/70 font-bold leading-relaxed max-w-[400px]">
              Join thousands of students and unlock a world of knowledge, community, and personal growth.
            </p>
          </div>

          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-10 h-10 rounded-full border-2 border-[#190019]" alt="user" />
              ))}
              <div className="w-10 h-10 rounded-full bg-[#522B5B] border-2 border-[#190019] flex items-center justify-center text-[12px] font-black text-[#FBE4D8]">
                +2k
              </div>
            </div>
            <p className="text-[14px] font-black uppercase tracking-widest text-white/40 italic">
              "The best education platform I've ever used." — Sarah J.
            </p>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white/5 lg:bg-transparent">
          <div className="w-full max-w-[400px] mx-auto">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-[32px] font-black text-white mb-2">
                {isLogin ? 'Welcome Back!' : 'Get Started'}
              </h2>
              <p className="text-white/60 font-bold text-[15px]">
                {isLogin ? 'Sign in to continue your journey.' : 'Create your account and join the community.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {!isLogin && (
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#DFB6B2]/30 group-focus-within:text-[#854F6C] transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-14 rounded-2xl pl-12 pr-6 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#522B5B] text-white font-bold text-[15px] transition-all"
                  />
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-white/60 transition-colors" />
                <input 
                  type="email" 
                  placeholder="name@email.com" 
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 rounded-2xl pl-12 pr-6 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#522B5B] text-white font-bold text-[15px] transition-all"
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-white/60 transition-colors" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 rounded-2xl pl-12 pr-6 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#522B5B] text-white font-bold text-[15px] transition-all"
                />
              </div>

              {isLogin && (
                <div className="flex justify-end -mt-2">
                  <button 
                    type="button"
                    onClick={() => setError('Password reset link sent to your email!')}
                    className="text-[12px] font-black text-white/40 hover:text-white transition-colors flex items-center gap-1.5 px-1"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> Forgot Password?
                  </button>
                </div>
              )}

              {error && (
                <p className="text-red-400 text-[13px] font-black px-1 animate-pulse">{error}</p>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#522B5B] to-[#854F6C] text-[#FBE4D8] font-black text-[16px] shadow-lg hover:scale-[0.98] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/20 border-t-[#FBE4D8] rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex flex-col gap-6 items-center">
              <div className="flex items-center gap-4 w-full text-gray-400/20">
                <div className="h-[1px] bg-white/5 flex-1" />
                <span className="text-[12px] font-black text-white/30 uppercase tracking-[0.2em]">Authentic Access</span>
                <div className="h-[1px] bg-white/5 flex-1" />
              </div>

              <p className="text-[14px] font-bold text-white/40">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button 
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="ml-2 text-white font-black hover:text-white/80 transition-colors underline underline-offset-4"
                >
                  {isLogin ? 'Sign Up' : 'Log In'}
                </button>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

