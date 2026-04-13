import {
  Trophy, Flame, Target, BookOpen,
  ChevronRight, TrendingUp, Award,
  Calendar as CalendarIcon, ChevronDown,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell,
} from 'recharts';
import { useProgress } from '../../hooks/useProgress';

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS = ['#8b5cf6', '#f59e0b', '#ec4899', '#10b981', '#3b82f6', '#ef4444'];
const WEAK_THRESHOLD = 50;
const STRONG_THRESHOLD = 70;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function topicsToChartData(topics: any) {
  if (!topics) return [];
  return Object.entries(topics).map(([topic, stat]: any) => {
    const acc = Number(stat?.accuracy) || 0;
    return {
      day: topic.charAt(0).toUpperCase() + topic.slice(1),
      xp: Number(acc.toFixed(1)),
    };
  });
}

function topicsToPieData(topics: any) {
  if (!topics) return [];
  const entries = Object.entries(topics);
  const total =
    entries.reduce((sum, [, stat]: any) => sum + (Number(stat?.accuracy) || 0), 0) || 1;
  return entries.map(([name, stat]: any, i: number) => {
    const acc = Number(stat?.accuracy) || 0;
    return {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Number(((acc / total) * 100).toFixed(1)),
      xp: `${acc.toFixed(1)}%`,
      color: COLORS[i % COLORS.length],
    };
  });
}

function topicsToProgressList(topics: any) {
  if (!topics) return [];
  const colorList = [
    'bg-purple-500', 'bg-blue-500',
    'bg-emerald-500', 'bg-amber-500',
    'bg-pink-500', 'bg-red-500',
  ];
  return Object.entries(topics).map(([name, stat]: any, i: number) => {
    const acc = Number(stat?.accuracy) || 0;
    return {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      progress: Math.round(acc),
      color: colorList[i % colorList.length],
      tag:
        acc < 50 ? '⚠️ Weak'
          : acc > 70 ? '✅ Strong'
            : '📈 Medium',
    };
  });
}

// ─── Custom Rotated X-Axis Tick ───────────────────────────────────────────────

const CustomBarTick = ({ x, y, payload }: any) => {
  const label = payload.value as string;
  const maxLen = 16;
  const display = label.length > maxLen ? label.slice(0, maxLen) + '…' : label;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={8}
        textAnchor="end"
        fill="#A19DAB"
        fontSize={11}
        fontWeight={700}
        transform="rotate(-35)"
      >
        {display}
      </text>
    </g>
  );
};

const CustomAreaTick = ({ x, y, payload }: any) => {
  const label = payload.value as string;
  const maxLen = 16;
  const display = label.length > maxLen ? label.slice(0, maxLen) + '…' : label;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={8}
        textAnchor="end"
        fill="#A19DAB"
        fontSize={11}
        fontWeight={700}
        transform="rotate(-35)"
      >
        {display}
      </text>
    </g>
  );
};

// ─── Sub-Components ───────────────────────────────────────────────────────────

function Card({ children, className = '', title, subtitle, extra }: any) {
  return (
    <div className={`bg-white/80 dark:bg-[#1C1627] rounded-[24px] border border-white/60 dark:border-white/5 shadow-sm p-6 flex flex-col relative ${className}`}>
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
    <div className="bg-white/80 dark:bg-[#1C1627] rounded-[24px] border border-white/60 dark:border-white/5 shadow-sm p-5 flex items-center gap-4 hover:translate-y-[-2px] transition-all">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${iconBg}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-[11px] font-black text-[#522B5B]/50 dark:text-[#DFB6B2]/40 uppercase tracking-widest leading-none mb-1.5">{title}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-[22px] font-black text-[#362A4A] dark:text-[#FBE4D8] leading-none">{value}</h4>
          {change && <span className="text-[10px] font-black text-emerald-500">{change}</span>}
        </div>
        <p className="text-[11px] font-bold text-[#522B5B]/40 dark:text-[#DFB6B2]/30 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#2B233C] border border-white/20 p-3 rounded-xl shadow-xl">
        <p className="text-[11px] font-black text-[#522B5B]/60 dark:text-[#DFB6B2]/50 mb-1">{label}</p>
        <p className="text-[13px] font-black text-[#362A4A] dark:text-[#FBE4D8]">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

// ─── Skeleton Loader ──────────────────────────────────────────────────────────

function Skeleton({ className = '' }: any) {
  return <div className={`animate-pulse bg-gray-200 dark:bg-white/10 rounded-xl ${className}`} />;
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Skeleton className="lg:col-span-6 h-[360px]" />
        <Skeleton className="lg:col-span-3 h-[360px]" />
        <Skeleton className="lg:col-span-3 h-[360px]" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Skeleton className="lg:col-span-4 h-[300px]" />
        <Skeleton className="lg:col-span-5 h-[300px]" />
        <Skeleton className="lg:col-span-3 h-[300px]" />
      </div>
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────

export function ProgressView() {
  const { data, loading, error } = useProgress();

  if (loading) return <LoadingSkeleton />;

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <p className="text-red-500 font-black text-lg mb-2">Failed to load progress</p>
        <p className="text-[#522B5B]/50 dark:text-[#DFB6B2]/40 text-sm">{error}</p>
      </div>
    </div>
  );

  const { overall, topics } = data;
  const allTopics = Object.entries(topics || {});
  const limitedTopics = Object.fromEntries(allTopics.slice(-4));

  const chartData = topicsToChartData(limitedTopics);
  const pieData = topicsToPieData(limitedTopics);
  const progressList = topicsToProgressList(limitedTopics);
  const topicCount = Object.keys(topics).length;

  const weakCount = progressList.filter(t => t.progress < WEAK_THRESHOLD).length;
  const strongCount = progressList.filter(t => t.progress > STRONG_THRESHOLD).length;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-[28px] md:text-[36px] font-black text-[#362A4A] dark:text-[#FBE4D8] leading-tight mb-2">
            Your Progress
          </h1>
          <p className="text-[#522B5B]/60 dark:text-[#A19DAB] font-semibold text-[14px]">
            Track your learning journey and celebrate every step forward.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-white/40 dark:bg-[#2B124C]/40 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/60 dark:border-white/10 shadow-sm text-[#362A4A] dark:text-[#FBE4D8] font-black text-[13px] hover:scale-105 transition-all w-fit">
          <CalendarIcon className="w-4 h-4 text-[#8b5cf6]" />
          All Time
          <ChevronDown className="w-4 h-4 opacity-50" />
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={Trophy}
          title="Total Sessions"
          value={overall.total_sessions}
          subtitle="quiz sessions completed"
          iconBg="bg-gradient-to-br from-purple-400 to-indigo-600"
        />
        <StatCard
          icon={Target}
          title="Overall Accuracy"
          value={`${overall.accuracy}%`}
          change={overall.accuracy >= 70 ? '✅ Strong' : overall.accuracy >= 50 ? '📈 Medium' : '⚠️ Weak'}
          subtitle="across all topics"
          iconBg="bg-gradient-to-br from-orange-400 to-red-500"
        />
        <StatCard
          icon={TrendingUp}
          title="Questions Attempted"
          value={overall.total_questions_attempted}
          subtitle="total questions"
          iconBg="bg-gradient-to-br from-blue-400 to-cyan-600"
        />
        <StatCard
          icon={BookOpen}
          title="Correct Answers"
          value={overall.total_correct_answers}
          change={`${topicCount} topics`}
          subtitle="total correct"
          iconBg="bg-gradient-to-br from-emerald-400 to-teal-600"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── Topic Accuracy Bar Chart (FIXED) ── */}
        <Card
          className="lg:col-span-6"
          title="Topic Accuracy"
          subtitle="Your accuracy % per topic"
        >
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-[#522B5B]/40 font-bold text-sm">
              No sessions yet. Start practicing!
            </div>
          ) : (
            <div className="h-[340px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 10, left: 0, bottom: 60 }}
                  barCategoryGap="25%"
                  barGap={4}
                >
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity={1} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="rgba(255,255,255,0.03)" />

                  {/* Rotated tick — fixes overlapping labels */}
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    height={70}
                    tick={<CustomBarTick />}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#A19DAB', fontSize: 11 }}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />

                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'white', fillOpacity: 0.03 }} />

                  <Bar
                    dataKey="xp"
                    radius={[12, 12, 12, 12]}
                    fill="url(#barGradient)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Summary Card */}
        <Card className="lg:col-span-3" title="Quick Summary" subtitle="Based on all your sessions">
          <div className="mt-2 flex flex-col gap-4">
            {[
              { label: 'Total Sessions', value: overall.total_sessions, color: 'text-purple-500' },
              { label: 'Questions Attempted', value: overall.total_questions_attempted, color: 'text-blue-500' },
              { label: 'Correct Answers', value: overall.total_correct_answers, color: 'text-emerald-500' },
              { label: 'Overall Accuracy', value: `${overall.accuracy}%`, color: 'text-amber-500' },
              { label: 'Topics Practiced', value: topicCount, color: 'text-pink-500' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                <span className="text-[12px] font-bold text-[#522B5B]/60 dark:text-[#DFB6B2]/50">{item.label}</span>
                <span className={`text-[15px] font-black ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Donut Chart */}
        <Card className="lg:col-span-3" title="Topic Breakdown">
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-[200px] text-[#522B5B]/40 font-bold text-sm">
              No data yet
            </div>
          ) : (
            <>
              <div className="h-[200px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      animationDuration={1500}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[18px] font-black text-[#362A4A] dark:text-[#FBE4D8]">{overall.accuracy}%</span>
                  <span className="text-[9px] font-bold text-[#522B5B]/50 dark:text-[#DFB6B2]/40 uppercase tracking-widest">Accuracy</span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {pieData.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-[11px]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-bold text-[#362A4A] dark:text-[#DFB6B2]">{item.name}</span>
                    </div>
                    <span className="font-black text-[#362A4A] dark:text-[#FBE4D8]">{item.xp}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Topic Progress List */}
        <Card className="lg:col-span-4" title="Topic Progress" subtitle="Accuracy per topic">
          <div className="absolute top-6 right-6 flex items-baseline gap-1">
            <span className="text-[18px] font-black text-[#362A4A] dark:text-[#FBE4D8]">{overall.accuracy}%</span>
            <span className="text-[9px] font-bold text-[#522B5B]/40 dark:text-[#DFB6B2]/30 uppercase tracking-widest">Avg</span>
          </div>
          {progressList.length === 0 ? (
            <p className="text-sm text-[#522B5B]/40 font-bold mt-8">No topics yet. Start a quiz!</p>
          ) : (
            <div className="mt-8 space-y-6">
              {progressList.map((course, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-white/5 flex items-center justify-center">
                        <BookOpen size={14} className={course.color.replace('bg-', 'text-')} />
                      </div>
                      <div>
                        <span className="text-[13px] font-black text-[#362A4A] dark:text-[#FBE4D8]">{course.name}</span>
                        <p className="text-[10px] font-bold text-[#522B5B]/40">{course.tag}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black text-[#522B5B]/50 dark:text-[#DFB6B2]/50">{course.progress}%</span>
                      <ChevronRight size={12} className="opacity-30 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-black/40 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${course.color} rounded-full transition-all duration-1000`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* ── Topic Performance Area Chart (FIXED) ── */}
        <Card className="lg:col-span-5" title="Topic Performance" subtitle="Accuracy trend across topics">
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-[280px] text-[#522B5B]/40 font-bold text-sm">
              No data yet
            </div>
          ) : (
            <div className="h-[320px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 60 }}
                >
                  <defs>
                    <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />

                  {/* Rotated tick — fixes overlapping labels */}
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    height={70}
                    tick={<CustomAreaTick />}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#A19DAB', fontSize: 11 }}
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="xp"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorActivity)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Performance Summary Card */}
        <Card className="lg:col-span-3" title="Performance" subtitle={`${topicCount} topics tracked`}>
          <div className="mt-4 space-y-4">
            {progressList.map((topic, i) => (
              <div key={i} className="p-3 rounded-xl bg-gray-50/50 dark:bg-white/5 border border-white dark:border-white/5 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#1C1627] flex items-center justify-center shadow-sm text-lg">
                      {topic.progress > STRONG_THRESHOLD ? '🏆' : topic.progress < WEAK_THRESHOLD ? '📚' : '🎯'}
                    </div>
                    <div>
                      <h5 className="text-[12px] font-black text-[#362A4A] dark:text-[#FBE4D8]">{topic.name}</h5>
                      <p className="text-[10px] font-bold text-[#522B5B]/50 dark:text-[#DFB6B2]/40">{topic.tag}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-black text-purple-500">{topic.progress}%</span>
                </div>
                <div className="w-full h-1 bg-gray-100 dark:bg-black/40 rounded-full">
                  <div
                    className={`h-full ${topic.color} rounded-full`}
                    style={{ width: `${topic.progress}%` }}
                  />
                </div>
              </div>
            ))}
            {progressList.length === 0 && (
              <p className="text-sm text-[#522B5B]/40 font-bold text-center py-8">
                Complete a quiz to see performance!
              </p>
            )}
          </div>
        </Card>

      </div>
    </div>
  );
}