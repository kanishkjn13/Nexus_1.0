import { useState, useCallback, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { HeroSection } from './components/HeroSection';
import { DashboardCards } from './components/DashboardCards';
import { TopNav } from './components/TopNav';
import { Footer } from './components/Footer';
import { AuthView } from './components/AuthView';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { AiView } from './components/AiView';
import { AboutView } from './components/AboutView';
import { ChallengesView } from './components/ChallengesView';
import { ProgressView } from './components/ProgressView';

const VIEWS = {
  HOME: 'home',
  CHALLENGES: 'challenges',
  PROGRESS: 'progress',
  AI: 'ai',
  SETTINGS: 'settings',
  PROFILE: 'profile',
  ABOUT: 'about'
};

interface UserProfile {
  name: string;
  email: string;
}

export default function App() {
  const [activeView, setActiveView] = useState(VIEWS.HOME);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthMounted, setIsAuthMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // On mount
  useEffect(() => {
    setIsAuthMounted(true);
  }, []);

  const onLogin = useCallback((userData: UserProfile) => {
    setUser(userData);
  }, []);

  const onLogout = useCallback(() => {
    setUser(null);
  }, []);

  const navigateTo = useCallback((view: string) => {
    setActiveView(view);
    const scroller = document.querySelector('.main-scroll');
    if (scroller) scroller.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderView = useMemo(() => {
    switch (activeView) {
      case VIEWS.HOME:
        return (
          <>
            <HeroSection onStartSession={() => navigateTo(VIEWS.AI)} />
            <DashboardCards searchQuery={searchQuery} />
          </>
        );
      case VIEWS.CHALLENGES:
        return <ChallengesView />;
      case VIEWS.PROGRESS:
        return <ProgressView />;
      case VIEWS.AI:
        return <AiView />;
      case VIEWS.ABOUT:
        return <AboutView />;
      case VIEWS.PROFILE:
        return user ? (
          <ProfileView user={user} onUpdateUser={onLogin} />
        ) : null;
      case VIEWS.SETTINGS:
        return <SettingsView />;
      default:
        return (
          <div className="flex flex-col items-center justify-center p-20 text-center animate-in fade-in slide-in-from-bottom-5 duration-500">
            <h2 className="text-4xl font-black text-[#362A4A] dark:text-[#FBE4D8] mb-4">Feature Locked</h2>
            <p className="text-[#522B5B]/70 dark:text-[#DFB6B2] font-semibold text-lg max-w-md">This section is currently being polished for the ultimate experience.</p>
          </div>
        );
    }
  }, [activeView, searchQuery]);

  // Initial mount protection to avoid auth flicker
  if (!isAuthMounted) return null;

  // Render Auth if no user is found
  if (!user) {
    return <AuthView onLogin={onLogin} />;
  }

  return (
    <div className="h-screen w-full bg-[#f8f6fb] dark:bg-[#190019] bg-gradient-to-br from-[#f8f6fb] via-[#f0ebf6] to-[#e8e3f0] dark:from-[#190019] dark:via-[#2B124C] dark:to-[#522B5B] font-sans transition-colors duration-500 overflow-hidden relative selection:bg-purple-200 dark:selection:bg-[#854F6C]/50">

      {/* Dynamic Ambient Lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] bg-cyan-400/20 dark:bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-[20%] right-[-5%] w-[40vw] h-[40vw] bg-pink-400/20 dark:bg-pink-500/10 rounded-full blur-[100px] pointer-events-none animate-float" />
      <div className="absolute bottom-[-10%] left-[10%] w-[50vw] h-[50vw] bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '3s' }} />
      <div className="absolute bottom-[20%] right-[20%] w-[35vw] h-[35vw] bg-amber-200/10 dark:bg-amber-500/10 rounded-full blur-[90px] pointer-events-none animate-float" style={{ animationDelay: '2s' }} />


      <Sidebar
        activeView={activeView}
        onNavigate={(view) => { navigateTo(view); setIsSidebarOpen(false); }}
        onLogout={onLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-[240px]' : 'ml-0 lg:ml-[240px]'} h-screen overflow-y-auto overscroll-y-contain scroll-smooth main-scroll relative z-10 flex flex-col no-scrollbar`}>
        <TopNav
          onSearch={setSearchQuery}
          user={user}
          onProfileClick={() => navigateTo(VIEWS.PROFILE)}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="flex-1 px-4 md:px-10 pb-16 max-w-[1600px] w-full mx-auto transition-all">
          {renderView}
          <Footer />
        </main>
      </div>
    </div>
  );
}
