import { useState } from 'react';
import { User, Mail, Phone, MapPin, GraduationCap, Award, Settings, Bell, Shield, LogOut, Camera, Save, CheckCircle2, Circle, ChevronDown } from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+1', name: 'USA', flag: '🇺🇸' },
  { code: '+44', name: 'UK', flag: '🇬🇧' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
  { code: '+971', name: 'UAE', flag: '🇦🇪' },
];

interface UserProfile {
  name: string;
  email: string;
}

interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (userData: UserProfile) => void;
}

export function ProfileView({ user, onUpdateUser }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    countryCode: '+91',
    phone: '98765 43210',
    bio: 'Passionate student exploring Discrete Mathematics and OS Theory. Goal: Top 5% of students worldwide.',
    gender: 'prefer-not-to-say', // Requirement
    course: 'Computer Science',
    level: 'Advanced Student (Level 7)'
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Mock save delay
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      onUpdateUser?.({ name: formData.name, email: formData.email });
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User }
  ];

  return (
    <div className="max-w-[1200px] mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header / Profile Summary */}
      <div className="bg-white/40 dark:bg-[#2B124C]/40 backdrop-blur-xl rounded-[32px] border border-white/60 dark:border-white/10 shadow-sm p-8 mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        {/* Background Decorative Blob */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-purple-200/20 dark:bg-[#854F6C]/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative group">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
            alt="Profile Avatar" 
            className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-[#2B124C] shadow-xl group-hover:brightness-75 transition-all"
          />
          <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-8 h-8 text-white" />
          </button>
        </div>

        <div className="flex-1 text-center md:text-left z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
            <h1 className="text-3xl font-black text-[#362A4A] dark:text-[#FBE4D8]">{formData.name}</h1>
          </div>
          <p className="text-[#362A4A]/60 dark:text-[#DFB6B2]/60 font-bold text-[15px] mb-4">Level 7 Student · 1,645 XP earned</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2 text-[#362A4A]/60 dark:text-[#DFB6B2]/50 text-[13px] font-bold">
              <Mail className="w-4 h-4" /> {formData.email}
            </div>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`px-8 h-14 rounded-2xl font-black text-[15px] shadow-lg transition-all flex items-center gap-2 active:scale-95 z-10 ${saveSuccess ? 'bg-green-300 dark:bg-green-400 text-green-950' : 'bg-gradient-to-r from-[#522B5B] to-[#854F6C] text-[#FBE4D8] hover:scale-[0.98]'}`}
        >
          {isSaving ? (
            <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
          ) : saveSuccess ? (
            <><CheckCircle2 className="w-5 h-5" /> Saved!</>
          ) : (
            <><Save className="w-5 h-5" /> Save Changes</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        


        {/* Content Section */}
        <div className="lg:col-span-12 bg-white/50 dark:bg-[#2B124C]/40 backdrop-blur-xl rounded-[32px] border border-white/60 dark:border-white/10 p-10 shadow-sm relative overflow-hidden">
          
          {activeTab === 'personal' && (
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-black text-[#362A4A] dark:text-[#FBE4D8]">Personal Information</h3>
                <p className="text-[#522B5B]/60 dark:text-[#DFB6B2]/50 font-bold text-[13px] uppercase tracking-wider">Update your account details</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-[13px] font-black text-[#522B5B] dark:text-[#DFB6B2]/70 uppercase tracking-widest pl-2">Full Name</label>
                  <input 
                    className="w-full h-14 rounded-2xl px-6 bg-white/60 dark:bg-black/20 border border-[#854F6C]/20 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-[#854F6C] font-bold text-[#362A4A] dark:text-[#FBE4D8] placeholder:text-[#362A4A]/30 dark:placeholder:text-[#DFB6B2]/30 transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[13px] font-black text-[#522B5B] dark:text-[#DFB6B2]/70 uppercase tracking-widest pl-2">Email Address</label>
                  <input 
                    className="w-full h-14 rounded-2xl px-6 bg-white/60 dark:bg-black/20 border border-[#854F6C]/20 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-[#854F6C] font-bold text-[#362A4A] dark:text-[#FBE4D8] placeholder:text-[#362A4A]/30 dark:placeholder:text-[#DFB6B2]/30 transition-all"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[13px] font-black text-[#522B5B] dark:text-[#DFB6B2]/70 uppercase tracking-widest pl-2">Phone Number</label>
                  <div className="flex gap-2">
                    <div className="relative shrink-0">
                      <select 
                        className="appearance-none h-14 w-[110px] rounded-2xl pl-4 pr-10 bg-white/60 dark:bg-black/20 border border-[#854F6C]/20 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-[#854F6C] font-bold text-[#362A4A] dark:text-[#FBE4D8] transition-all cursor-pointer"
                        value={formData.countryCode}
                        onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                      >
                        {COUNTRY_CODES.map(c => (
                          <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      className="flex-1 h-14 rounded-2xl px-6 bg-white/60 dark:bg-black/20 border border-[#854F6C]/20 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-[#854F6C] font-bold text-[#362A4A] dark:text-[#FBE4D8] placeholder:text-[#362A4A]/30 dark:placeholder:text-[#DFB6B2]/30 transition-all"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                {/* Gender Selection */}
                <div className="flex flex-col gap-3">
                  <label className="text-[13px] font-black text-[#522B5B] dark:text-[#DFB6B2]/70 uppercase tracking-widest pl-2">Gender</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Male', 'Female', 'Other'].map((g) => {
                      const lowerG = g.toLowerCase();
                      const isSelected = formData.gender === lowerG;
                      return (
                        <button 
                          key={g} 
                          onClick={() => setFormData({...formData, gender: lowerG})}
                          className={`h-14 rounded-xl font-bold text-[14px] border transition-all flex items-center justify-center gap-2 ${isSelected ? 'bg-[#522B5B]/20 dark:bg-[#522B5B]/30 border-[#854F6C] text-[#522B5B] dark:text-[#FBE4D8]' : 'bg-white/40 dark:bg-white/10 border-[#854F6C]/20 dark:border-white/5 text-[#362A4A]/50 dark:text-[#DFB6B2]/50 hover:bg-[#522B5B]/10 dark:hover:bg-white/20 hover:text-[#522B5B] dark:hover:text-[#FBE4D8]'}`}
                        >
                          {isSelected ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 opacity-40" />}
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[13px] font-black text-[#522B5B] dark:text-[#DFB6B2]/70 uppercase tracking-widest pl-2">Short Bio</label>
                <textarea 
                  rows={4}
                  className="w-full rounded-2xl p-6 bg-white/60 dark:bg-black/20 border border-[#854F6C]/20 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-[#854F6C] font-bold text-[#362A4A] dark:text-[#FBE4D8] placeholder:text-[#362A4A]/30 dark:placeholder:text-[#DFB6B2]/30 transition-all resize-none"
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}
