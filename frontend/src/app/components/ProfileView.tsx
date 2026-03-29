import { useState } from 'react';
import { User, Mail, Phone, MapPin, GraduationCap, Award, Settings, Bell, Shield, LogOut, Camera, Save, CheckCircle2, Circle } from 'lucide-react';

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
    phone: '+1 (555) 000-0000',
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
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'academic', label: 'Academic Details', icon: GraduationCap }
  ];

  return (
    <div className="max-w-[1200px] mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header / Profile Summary */}
      <div className="bg-white/40 dark:bg-[#2B124C]/40 backdrop-blur-xl rounded-[32px] border border-white/60 dark:border-white/10 shadow-sm p-8 mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        {/* Background Decorative Blob */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-purple-200/20 dark:bg-[#854F6C]/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative group">
          <img 
            src="https://i.pravatar.cc/150?img=1" 
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
            <span className="w-fit mx-auto md:mx-0 px-3 py-1 bg-[#854F6C]/20 text-[#522B5B] dark:text-[#DFB6B2] border border-[#854F6C]/30 rounded-full text-[12px] font-black uppercase tracking-wider">Premium Member</span>
          </div>
          <p className="text-[#362A4A]/60 dark:text-[#DFB6B2]/60 font-bold text-[15px] mb-4">Level 7 Student · 1,645 XP earned</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="flex items-center gap-2 text-[#362A4A]/60 dark:text-[#DFB6B2]/50 text-[13px] font-bold">
              <Mail className="w-4 h-4" /> {formData.email}
            </div>
            <div className="flex items-center gap-2 text-[#362A4A]/60 dark:text-[#DFB6B2]/50 text-[13px] font-bold">
              <MapPin className="w-4 h-4" /> San Francisco, CA
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
        
        {/* Sidebar Nav */}
        <div className="lg:col-span-3">
          <div className="bg-white/50 dark:bg-[#2B124C]/40 backdrop-blur-xl rounded-[28px] border border-white/60 dark:border-white/10 p-4 flex flex-col gap-2 shadow-sm">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-[15px] transition-all ${isActive ? 'bg-[#522B5B]/20 dark:bg-[#522B5B]/30 text-[#522B5B] dark:text-[#FBE4D8] shadow-sm' : 'text-[#362A4A]/50 dark:text-[#DFB6B2]/50 hover:bg-[#522B5B]/10 dark:hover:bg-white/5 hover:text-[#522B5B] dark:hover:text-[#FBE4D8]'}`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#854F6C] dark:text-[#FBE4D8]' : 'text-inherit'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Section */}
        <div className="lg:col-span-9 bg-white/50 dark:bg-[#2B124C]/40 backdrop-blur-xl rounded-[32px] border border-white/60 dark:border-white/10 p-10 shadow-sm relative overflow-hidden">
          
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
                  <input 
                    className="w-full h-14 rounded-2xl px-6 bg-white/60 dark:bg-black/20 border border-[#854F6C]/20 dark:border-white/5 focus:outline-none focus:ring-2 focus:ring-[#854F6C] font-bold text-[#362A4A] dark:text-[#FBE4D8] placeholder:text-[#362A4A]/30 dark:placeholder:text-[#DFB6B2]/30 transition-all"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
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

          {activeTab !== 'personal' && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
               <Award className="w-20 h-20 text-[#854F6C]/20 dark:text-[#DFB6B2]/10 mb-6" />
               <h4 className="text-2xl font-black text-[#362A4A] dark:text-[#FBE4D8] mb-2">Section Coming Soon</h4>
               <p className="text-[#362A4A]/60 dark:text-[#DFB6B2]/60 font-bold max-w-sm">We're still polishing the {activeTab} section to bring you the best experience.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
