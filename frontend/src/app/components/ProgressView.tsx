import { 
  Trophy, 
  Flame, 
  Target, 
  BookOpen, 
  ChevronRight, 
  TrendingUp, 
  Award,
  Calendar as CalendarIcon,
  ChevronDown,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useMemo } from 'react';

// --- Types & Data ---

const STREAK_DATA = [
  { day: 'Mon', xp: 40 },
  { day: 'Tue', xp: 60 },
  { day: 'Wed', xp: 80 },
  { day: 'Thu', xp: 100, high: true },
  { day: 'Fri', xp: 70 },
  { day: 'Sat', xp: 50 },
  { day: 'Sun', xp: 30, today: true },
];

const WEEKLY_ACTIVITY_DATA = [
  { day: 'Mon', activity: 200 },
  { day: 'Tue', activity: 450 },
  { day: 'Wed', activity: 380 },
  { day: 'Thu', activity: 850 },
  { day: 'Fri', activity: 520 },
  { day: 'Sat', activity: 780 },
  { day: 'Sun', activity: 720 },
];

const XP_BREAKDOWN_DATA = [
  { name: 'Courses', value: 60, xp: '7,680 XP', color: '#8b5cf6' },
  { name: 'Quizzes', value: 20, xp: '2,560 XP', color: '#f59e0b' },
  { name: 'Challenges', value: 15, xp: '1,920 XP', color: '#ec4899' },
  { name: 'Others', value: 5, xp: '680 XP', color: '#10b981' },
];

const LEARNING_COURSES = [
  { name: 'Discrete Mathematics', progress: 72, color: 'bg-purple-500' },
  { name: 'Operating Systems', progress: 45, color: 'bg-blue-500' },
  { name: 'Data Structures', progress: 90, color: 'bg-emerald-500' },
  { name: 'Logic & Proofs', progress: 60, color: 'bg-amber-500' },
];

const ACHIEVEMENTS = [
  { id: 1, title: 'Early Bird', desc: 'Study before 8 AM', xp: '+100 XP', progress: 100, icon: '⭐' },
  { id: 2, title: 'Week Warrior', desc: 'Maintain a 7-day streak', xp: '+250 XP', progress: 100, icon: '🔥' },
  { id: 3, title: 'Quiz Master', desc: 'Score 90%+ on 10 quizzes', xp: '+300 XP', progress: 70, current: '7/10', icon: '🎯' },
  { id: 4, title: 'Course Conqueror', desc: 'Complete 5 courses', xp: '+500 XP', progress: 60, current: '3/5', icon: '🏆' },
];

// --- Sub-Components ---

function Card({ children, className = "", title, subtitle, extra }: any) {
  return (
    <div className={`bg-white/80 dark:bg-[#1C1627] rounded-[24px] border border-white/60 dark:border-white/5 shadow-sm p-6 flex flex-col ${className}`}>
      {(title || extra) && (
        <div className="flex justify-between items-center mb-6">
          <div>
            {title && <h3 className="text-[17px] font-black text-[#362A4A] dark:text-[#FBE4D8] leading-tight">{title}</h3>}
            {subtitle && <p className="text-[12px] font-bold text-[#522B5B]/50 dark:text-[#DFB6B2]/40 mt-0.5">{subtitle}</p>}
          </div>
          {extra}
        </div>
      )}
      {children}
    </div>
  );
}

function StatCard({ icon: Icon, title, value, change, subtitle, iconBg }: any) {
  return (
    <div className="bg-white/80 dark:bg-[#1C1627] rounded-[24px] border border-white/60 dark:border-white/5 shadow-sm p-5 flex items-center gap-4 group hover:translate-y-[-2px] transition-all">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${iconBg}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-[11px] font-black text-[#522B5B]/50 dark:text-[#DFB6B2]/40 uppercase tracking-widest leading-none mb-1.5">{title}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-[22px] font-black text-[#362A4A] dark:text-[#FBE4D8] leading-none">{value}</h4>
          {change && <span className="text-[10px] font-black text-emerald-500 dark:text-emerald-400">{change}</span>}
        </div>
        <p className="text-[11px] font-bold text-[#522B5B]/40 dark:text-[#DFB6B2]/30 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#2B233C] border border-white/20 dark:border-white/5 p-3 rounded-xl shadow-2xl shadow-black/20">
        <p className="text-[12px] font-black text-[#362A4A] dark:text-[#FBE4D8]">{`${payload[0].value} XP`}</p>
      </div>
    );
  }
  return null;
};

export function ProgressView() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header View */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-[36px] font-black text-[#362A4A] dark:text-[#FBE4D8] leading-tight mb-2">Your Progress</h1>
          <p className="text-[#522B5B]/60 dark:text-[#A19DAB] font-semibold text-[15px]">Track your learning journey and celebrate every step forward.</p>
        </div>
        <button className="flex items-center gap-2 bg-white/40 dark:bg-[#2B124C]/40 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/60 dark:border-white/10 shadow-sm text-[#362A4A] dark:text-[#FBE4D8] font-black text-[13px] hover:scale-105 transition-all">
          <CalendarIcon className="w-4 h-4 text-[#8b5cf6]" />
          This Week
          <ChevronDown className="w-4 h-4 opacity-50" />
        </button>
      </div>

      {/* Top Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          icon={Trophy} 
          title="Total XP" 
          value="12,840" 
          change="+12.5%" 
          subtitle="from last week" 
          iconBg="bg-gradient-to-br from-purple-400 to-indigo-600 shadow-purple-500/20"
        />
        <StatCard 
          icon={Flame} 
          title="Current Streak" 
          value="7 days" 
          subtitle="Keep it going!" 
          iconBg="bg-gradient-to-br from-orange-400 to-red-500 shadow-orange-500/20"
        />
        <StatCard 
          icon={TrendingUp} 
          title="Longest Streak" 
          value="15 days" 
          subtitle="Achieved on May 10" 
          iconBg="bg-gradient-to-br from-blue-400 to-cyan-600 shadow-blue-500/20"
        />
        <StatCard 
          icon={BookOpen} 
          title="Courses Completed" 
          value="8" 
          change="+2 this month" 
          subtitle="Keep learning!" 
          iconBg="bg-gradient-to-br from-emerald-400 to-teal-600 shadow-emerald-500/20"
        />
      </div>

      {/* Second Row: Charts & Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Study Streak Bar Chart */}
        <Card 
          className="lg:col-span-6" 
          title="Study Streak" 
          subtitle="Your daily study activity for the past 7 days."
        >
          <div className="h-[300px] w-full mt-6 relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={STREAK_DATA} 
                margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                barGap={8}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={1} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="todayBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f472b6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity={1} />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#A19DAB', fontSize: 12, fontWeight: '900' }} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#A19DAB', fontSize: 11, fontWeight: 'bold' }} 
                />
                <Tooltip 
                  content={<CustomTooltip />} 
                  cursor={{ fill: 'white', fillOpacity: 0.03, radius: 12 }} 
                />
                <Bar 
                  dataKey="xp" 
                  radius={[12, 12, 12, 12]} 
                  barSize={32}
                  animationDuration={2000}
                  animationEasing="ease-out"
                >
                  {STREAK_DATA.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.today ? 'url(#todayBarGradient)' : 'url(#barGradient)'}
                      style={{ 
                        filter: entry.today ? 'drop-shadow(0 0 8px rgba(236,72,153,0.4))' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-between items-center mt-6 px-2 pt-6 border-t border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-400 to-indigo-600 shadow-lg" />
              <span className="text-[11px] font-black text-[#362A4A]/60 dark:text-[#DFB6B2]/60 uppercase tracking-widest">Normal Day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-pink-400 to-rose-600 shadow-lg" />
              <span className="text-[11px] font-black text-[#362A4A]/60 dark:text-[#DFB6B2]/60 uppercase tracking-widest">Today</span>
            </div>
            <div className="text-[13px] font-black text-purple-500">
              Avg: 61 XP
            </div>
          </div>
        </Card>

        {/* Small Calendar/Streak UI */}
        <Card className="lg:col-span-3 overflow-hidden relative" title="7 day streak" subtitle="You're on fire! 🔥">
          <div className="mt-4 flex flex-col items-center">
            <div className="w-full flex justify-between items-center text-[12px] font-black text-[#362A4A] dark:text-[#FBE4D8] mb-4">
              <span>May 2024</span>
              <ChevronDown className="w-3 h-3 opacity-50" />
            </div>
            <div className="grid grid-cols-7 w-full gap-2 text-center">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                <span key={d} className="text-[10px] font-black text-[#522B5B]/40 dark:text-[#DFB6B2]/30 mb-2">{d}</span>
              ))}
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                const isStreak = day >= 6 && day <= 12;
                const isToday = day === 25;
                return (
                  <div 
                    key={day} 
                    className={`h-7 w-7 flex items-center justify-center rounded-lg text-[11px] font-bold ${
                      isStreak 
                        ? 'bg-[#8b5cf6] text-white shadow-lg shadow-purple-500/20' 
                        : isToday 
                          ? 'border-2 border-[#8b5cf6] text-[#8b5cf6]' 
                          : 'text-[#362A4A] dark:text-[#DFB6B2]/60 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* XP Breakdown Donut Chart */}
        <Card className="lg:col-span-3" title="XP Breakdown">
          <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={XP_BREAKDOWN_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationDuration={1500}
                >
                  {XP_BREAKDOWN_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[18px] font-black text-[#362A4A] dark:text-[#FBE4D8]">12,840</span>
              <span className="text-[9px] font-bold text-[#522B5B]/50 dark:text-[#DFB6B2]/40 uppercase tracking-widest">Total XP</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {XP_BREAKDOWN_DATA.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-bold text-[#362A4A] dark:text-[#DFB6B2]">{item.name}</span>
                </div>
                <div className="flex gap-4">
                  <span className="font-black text-[#522B5B]/40 dark:text-[#DFB6B2]/40">{item.value}%</span>
                  <span className="font-black text-[#362A4A] dark:text-[#FBE4D8] w-[60px] text-right">{item.xp}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Third Row: Learning Progress & Weekly Activity & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Learning Progress List */}
        <Card className="lg:col-span-4" title="Learning Progress" subtitle="Overall progress in your courses">
          <div className="absolute top-6 right-6 flex items-baseline gap-1">
             <span className="text-[18px] font-black text-[#362A4A] dark:text-[#FBE4D8]">72%</span>
             <span className="text-[9px] font-bold text-[#522B5B]/40 dark:text-[#DFB6B2]/30 uppercase tracking-widest">Avg</span>
          </div>
          <div className="mt-8 space-y-6">
            {LEARNING_COURSES.map((course, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${course.color.replace('bg-', 'bg-opacity-10 dark:bg-opacity-20 ')} flex items-center justify-center`}>
                      <BookOpen size={14} className={course.color.replace('bg-', 'text-')} />
                    </div>
                    <span className="text-[13px] font-black text-[#362A4A] dark:text-[#FBE4D8]">{course.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black text-[#522B5B]/50 dark:text-[#DFB6B2]/50">{course.progress}%</span>
                    <ChevronRight size={12} className="opacity-30 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-black/40 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${course.color} rounded-full transition-all duration-1000 shadow-sm`} 
                    style={{ width: `${course.progress}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Weekly Activity Area Chart */}
        <Card className="lg:col-span-5" title="Weekly Activity" subtitle="Your learning activity overview">
          <div className="h-[280px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_ACTIVITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#A19DAB', fontSize: 11, fontWeight: 'bold' }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#A19DAB', fontSize: 11, fontWeight: 'bold' }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="activity" 
                  stroke="#8b5cf6" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorActivity)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Achievements List */}
        <Card 
          className="lg:col-span-3" 
          title="Achievements" 
          subtitle="4 / 10 unlocked"
          extra={<button className="text-[11px] font-black text-purple-500 hover:underline">View All</button>}
        >
          <div className="mt-4 space-y-4">
            {ACHIEVEMENTS.map((ach) => (
              <div key={ach.id} className="p-3 rounded-xl bg-gray-50/50 dark:bg-white/5 border border-white dark:border-white/5 flex flex-col gap-2 group hover:bg-white dark:hover:bg-white/10 transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#1C1627] flex items-center justify-center shadow-sm text-lg">
                      {ach.icon}
                    </div>
                    <div>
                      <h5 className="text-[12px] font-black text-[#362A4A] dark:text-[#FBE4D8]">{ach.title}</h5>
                      <p className="text-[10px] font-bold text-[#522B5B]/50 dark:text-[#DFB6B2]/40">{ach.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-purple-600 dark:text-purple-400">{ach.xp}</span>
                    {ach.current && <p className="text-[9px] font-bold text-gray-400 mt-0.5">{ach.current}</p>}
                  </div>
                </div>
                {ach.progress < 100 && (
                  <div className="w-full h-1 bg-gray-100 dark:bg-black/40 rounded-full mt-1">
                    <div 
                      className="h-full bg-purple-500 rounded-full" 
                      style={{ width: `${ach.progress}%` }} 
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

      </div>

    </div>
  );
}
