import React, { useMemo } from 'react';
import {
  Trophy, Target, BookOpen,
  ChevronDown, Activity, Zap, TrendingUp
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell,
} from 'recharts';
import { useProgress } from '../../hooks/useProgress';

// ─── Constants ───
const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#ef4444'];
const STRONG_THRESHOLD = 75;

// ─── Helpers ───
const formatTopicName = (name: string) => name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' ');

function topicsToChartData(topics: any) {
  if (!topics) return [];
  return Object.entries(topics).map(([topic, stat]: any) => ({
    name: formatTopicName(topic),
    accuracy: Number((Number(stat?.accuracy) || 0).toFixed(1)),
  }));
}

function topicsToProgressList(topics: any) {
  if (!topics) return [];
  const colorList = ['bg-purple-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-pink-500', 'bg-red-500'];
  return Object.entries(topics).map(([name, stat]: any, i: number) => {
    const acc = Number(stat?.accuracy) || 0;
    return {
      name: formatTopicName(name),
      progress: Math.round(acc),
      color: colorList[i % colorList.length],
      tag: acc < 50 ? '⚠️ Weak' : acc > 75 ? '✅ Strong' : '📈 Medium',
    };
  });
}

// ─── Components ───
function Card({ children, className = '', title, subtitle, icon: Icon }: any) {
  return (
    <div className={`group bg-white/70 dark:bg-[#1C1627]/80 backdrop-blur-md rounded-[32px] border border-white/40 dark:border-white/5 shadow-xl p-7 flex flex-col relative overflow-hidden transition-all hover:shadow-2xl ${className}`}>
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex gap-3 items-center">
          {Icon && <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500"><Icon size={18} /></div>}
          <div>
            <h3 className="text-[18px] font-black text-[#362A4A] dark:text-[#FBE4D8] tracking-tight">{title}</h3>
            <p className="text-[13px] font-medium text-[#522B5B]/50 dark:text-[#A19DAB]/60">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="relative z-10 flex-1">{children}</div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, colorClass }: any) {
  return (
    <div className="relative group bg-white/80 dark:bg-[#1C1627] rounded-[28px] border border-white/60 dark:border-white/5 p-6 transition-all hover:-translate-y-1 shadow-sm overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-2xl opacity-10 ${colorClass}`} />
      <div className="flex flex-col gap-4 relative z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${colorClass} text-white`}><Icon size={24} /></div>
        <div>
          <p className="text-[11px] font-black text-[#522B5B]/40 dark:text-[#A19DAB]/50 uppercase tracking-widest mb-1">{title}</p>
          <h4 className="text-[26px] font-black text-[#362A4A] dark:text-[#FBE4D8]">{value}</h4>
        </div>
      </div>
    </div>
  );
}

export function ProgressView() {
  const { data, loading } = useProgress();

  // Process data - using slice(-6) to always get the LATEST items
  const processed = useMemo(() => {
    if (!data?.topics) return { chart: [], list: [], total: 0 };
    const entries = Object.entries(data.topics);
    const selection = entries.slice(-6); // Grab newest 6
    return {
      chart: topicsToChartData(Object.fromEntries(selection)),
      list: topicsToProgressList(Object.fromEntries(selection)),
      total: entries.length
    };
  }, [data]);

  if (loading || !data) return <div className="p-10 text-center font-black animate-pulse">Loading Analytics...</div>;

  return (
    <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-700">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-[#362A4A] dark:text-[#FBE4D8]">Learning Analytics</h1>
        <div className="px-4 py-2 bg-white dark:bg-[#1C1627] rounded-xl shadow-sm text-xs font-black text-purple-500 border border-white/40">ALL TIME</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Trophy} title="Total Sessions" value={data.overall.total_sessions} colorClass="bg-indigo-500" />
        <StatCard icon={Target} title="Average Accuracy" value={`${data.overall.accuracy}%`} colorClass="bg-orange-500" />
        <StatCard icon={Activity} title="Total Questions" value={data.overall.total_questions_attempted} colorClass="bg-blue-500" />
        <StatCard icon={Zap} title="Topics Explored" value={processed.total} colorClass="bg-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Bar Chart */}
        <Card className="lg:col-span-8" title="Recent Performance" subtitle="Accuracy of your last 6 topics" icon={Activity}>
          <div className="h-[350px] w-full" key={processed.total}> {/* Key forces re-render when total changes */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processed.chart} margin={{ top: 20, bottom: 40, left: -20 }}>
                <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} angle={-15} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} domain={[0, 100]} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Bar dataKey="accuracy" radius={[10, 10, 10, 10]} barSize={40}>
                  {processed.chart.map((entry, i) => (
                    <Cell key={i} fill={entry.accuracy > STRONG_THRESHOLD ? '#8b5cf6' : '#c084fc'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Detailed Progress List */}
        <Card className="lg:col-span-4" title="Topic Mastery" subtitle="Latest Activity" icon={BookOpen}>
          <div className="space-y-6 mt-4">
            {processed.list.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[13px] font-black">
                  <span>{item.name}</span>
                  <span className="text-purple-500">{item.progress}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} transition-all duration-1000`} style={{ width: `${item.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Growth Curve */}
        <Card className="lg:col-span-12" title="Learning Growth Curve" subtitle="Consistency across recent topics" icon={TrendingUp}>
          <div className="h-[300px] w-full" key={`growth-${processed.total}`}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={processed.chart} margin={{ left: -20, right: 20 }}>
                <defs>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="accuracy" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}