import { useEffect, useState } from 'react';
import { apiFetch } from '../../api/client';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, Cell
} from 'recharts';
import {
  Trophy, Target, Zap, TrendingUp, Brain, CheckCircle2,
  AlertCircle, ArrowRight, RefreshCw
} from 'lucide-react';

/* ─── Types ─── */
interface OverallData {
  total_sessions: number;
  total_questions_attempted: number;
  total_correct_answers: number;
  accuracy: number;
}
interface TopicRow {
  topic: string;
  attempted: number;
  correct: number;
  accuracy: number;
}
interface ProgressData {
  overall: OverallData;
  topics: TopicRow[];
}
interface AiFeedback {
  weak_topics: string[];
  strong_topics: string[];
  feedback: string;
  next_steps: string[];
}
interface RecommendationData {
  weak_topics: string[];
  strong_topics: string[];
}

/* ─── THEME COLORS ─── */
const COLORS = {
  primary: '#362A4A',
  secondary: '#522B5B',
  accent: '#854F6C',
};

/* ─── Card ─── */
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/30 dark:bg-[#2B124C]/30 backdrop-blur-3xl rounded-[24px] border border-white/40 dark:border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.08)] ${className}`}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-[11px] font-black text-[#522B5B]/50 dark:text-[#DFB6B2]/50 uppercase tracking-widest">{children}</span>;
}

/* ─── Stat Card ─── */
function StatCard({ icon: Icon, label, value }: any) {
  return (
    <Card className="p-6 flex items-center gap-5 hover:scale-[1.02] transition-all">
      <div className="w-14 h-14 rounded-[18px] flex items-center justify-center bg-[#362A4A] shadow-md">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <Label>{label}</Label>
        <div className="text-[26px] font-black text-[#362A4A] dark:text-[#FBE4D8] mt-1">{value}</div>
      </div>
    </Card>
  );
}

/* ─── Tooltip ─── */
const CUSTOM_TOOLTIP = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-[#2B124C]/80 backdrop-blur-xl border border-white/30 rounded-xl px-3 py-2 shadow-lg">
      <p className="font-bold text-[#362A4A] dark:text-[#FBE4D8] text-sm">{label}</p>
      <p className="text-xs text-[#522B5B]/60">{payload[0].value}% accuracy</p>
    </div>
  );
};

/* ─── Main ─── */
export function ProgressView() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [aiFeedback, setAiFeedback] = useState<AiFeedback | null>(null);
  const [recommendation, setRecommendation] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [p, r, a] = await Promise.all([
        apiFetch('/api/progress/'),
        apiFetch('/api/recommendation/'),
        apiFetch('/api/ai-feedback/')
      ]);
      setProgress(p);
      setRecommendation(r);
      setAiFeedback(a);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const barColor = (acc: number) =>
    acc >= 75 ? COLORS.accent : acc >= 50 ? COLORS.secondary : COLORS.primary;

  const overallAcc = progress?.overall.accuracy ?? 0;

  if (loading) {
    return <div className="flex justify-center py-20">Loading...</div>;
  }

  return (
    <div className="max-w-[1200px] mx-auto py-8 flex flex-col gap-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black text-[#362A4A] dark:text-[#FBE4D8]">Your Progress</h1>
        <button
          onClick={fetchData}
          className="px-5 py-2 rounded-xl bg-[#522B5B]/10 hover:bg-[#522B5B]/20 font-bold"
        >
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <StatCard icon={Zap} label="Sessions" value={progress?.overall.total_sessions} />
        <StatCard icon={Target} label="Questions" value={progress?.overall.total_questions_attempted} />
        <StatCard icon={CheckCircle2} label="Correct" value={progress?.overall.total_correct_answers} />
        <StatCard icon={Trophy} label="Accuracy" value={`${Math.round(overallAcc)}%`} />
      </div>

      {/* Chart */}
      <Card className="p-6">
        <Label>Accuracy by Topic</Label>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={progress?.topics}>
            <XAxis dataKey="topic" />
            <YAxis />
            <Tooltip content={<CUSTOM_TOOLTIP />} />
            <Bar dataKey="accuracy">
              {progress?.topics.map((t, i) => (
                <Cell key={i} fill={barColor(t.accuracy)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Radial */}
      <Card className="p-6 flex flex-col items-center">
        <Label>Overall Accuracy</Label>
        <RadialBarChart width={200} height={200} innerRadius="70%" outerRadius="100%" data={[{ value: overallAcc }]}>
          <RadialBar dataKey="value" fill={barColor(overallAcc)} />
        </RadialBarChart>
        <h2 className="text-2xl font-black">{Math.round(overallAcc)}%</h2>
      </Card>

      {/* AI Feedback */}
      {aiFeedback && (
        <Card className="p-6">
          <Label>AI Feedback</Label>
          <p className="mt-3 font-bold">{aiFeedback.feedback}</p>
        </Card>
      )}

      {/* Recommendation */}
      {recommendation && (
        <Card className="p-6 flex gap-2 flex-wrap">
          {recommendation.weak_topics.map((t, i) => (
            <span key={i} className="px-3 py-1 bg-[#362A4A]/10 rounded-full text-sm">
              ⚠ {t}
            </span>
          ))}
          {recommendation.strong_topics.map((t, i) => (
            <span key={i} className="px-3 py-1 bg-[#854F6C]/10 rounded-full text-sm">
              ✓ {t}
            </span>
          ))}
        </Card>
      )}

    </div>
  );
}