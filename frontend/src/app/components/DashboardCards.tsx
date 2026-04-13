import {
  Trophy, Zap, CheckCircle2, ChevronRight, Target, Flame,
  PlusCircle, Trash, X, Play, Square, RefreshCw, Clock
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useProgress } from '../../hooks/useProgress';

// --- Static Data ---
const INITIAL_STUDENTS = [
  { name: 'Lily K.', level: 7, xp: 1645, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily', rank: '🥇', color: 'from-amber-200 to-orange-300' },
  { name: 'Umar M.', level: 6, xp: 1350, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Umar', rank: '🥈', color: 'from-cyan-200 to-blue-300' },
  { name: 'Priya S.', level: 6, xp: 1235, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', rank: '🥉', color: 'from-purple-200 to-pink-300' },
];

function Card({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-white/40 dark:bg-[#2B124C]/40 backdrop-blur-xl rounded-[20px] border border-white/60 dark:border-white/10 shadow-sm transition-all hover:shadow-xl hover:translate-y-[-2px] duration-300 ${className}`}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-[11px] font-black text-[#522B5B]/70 dark:text-[#DFB6B2]/70 uppercase tracking-widest leading-none">{children}</span>;
}

export function DashboardCards({ searchQuery = '' }) {
  const { data } = useProgress(); // Pulling overall accuracy for the Goal card

  // --- Timer State ---
  const [seconds, setSeconds] = useState(1500); // 25:00
  const [isActive, setIsActive] = useState(false);

  // --- Task Manager State ---
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Discrete Math Assignment', label: 'Urgent', time: '2h left', checked: false, priority: true },
    { id: 2, name: 'Research for Physics Lab', label: 'Draft', time: 'Tomorrow', checked: false },
    { id: 3, name: 'Email Professor Smith', label: 'Inquiry', time: 'Today', checked: true },
  ]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');

  // ─── Timer Logic ───
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);
  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // ─── Task Management Logic ───
  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  const addTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTaskName.trim()) return;
    setTasks([{ id: Date.now(), name: newTaskName, label: 'New', time: 'Just now', checked: false }, ...tasks]);
    setNewTaskName('');
    setIsAddingTask(false);
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const urgentTask = useMemo(() =>
    tasks.find(t => !t.checked && (t.priority || t.label === 'Urgent')) || tasks.find(t => !t.checked),
    [tasks]
  );

  const filteredStudents = INITIAL_STUDENTS.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="dash-grid mt-4 animate-in fade-in duration-700">

      {/* ════════════════════════════════════════════════ */}
      {/* [STOPWATCH/TIMER] Replaced Continue Studying     */}
      {/* ════════════════════════════════════════════════ */}
      <Card className="dash-studying p-6 flex flex-col relative group overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex justify-between items-center mb-6">
          <Label>Focus Session</Label>
          <Clock className={`w-4 h-4 ${isActive ? 'text-purple-500 animate-pulse' : 'text-gray-400'}`} />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-[64px] font-black text-[#362A4A] dark:text-[#FBE4D8] tracking-tighter leading-none mb-6">
            {formatTime(seconds)}
          </div>

          <div className="flex gap-3 w-full relative z-10">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`flex-1 h-12 rounded-2xl font-black text-[13px] flex items-center justify-center gap-2 transition-all active:scale-95 ${isActive
                ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                : 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                }`}
            >
              {isActive ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
              {isActive ? 'Stop' : 'Start Focus'}
            </button>
            <button
              onClick={() => { setIsActive(false); setSeconds(1500); }}
              className="w-12 h-12 rounded-2xl bg-white/60 dark:bg-white/5 border border-white dark:border-white/10 flex items-center justify-center text-gray-500 hover:rotate-180 transition-all duration-500"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
        <p className="text-center text-[10px] font-bold text-[#522B5B]/40 dark:text-[#DFB6B2]/30 mt-6 uppercase tracking-widest">
          Timer helps you stay productive
        </p>
      </Card>

      {/* ════════════════════════════════════════════════ */}
      {/* [STATIC] Leaderboard — As requested                */}
      {/* ════════════════════════════════════════════════ */}
      <Card className="dash-students p-5 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <Label>Global Leaderboard</Label>
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
        </div>
        <div className="flex flex-col gap-2">
          {filteredStudents.map((s, i) => (
            <div key={i} className="flex items-center gap-2.5 p-2 rounded-[14px]">
              <span className="text-[17px] w-5 text-center shrink-0">{s.rank}</span>
              <img src={s.img} className="w-8 h-8 rounded-full border-2 border-white dark:border-white/5 shadow-sm" alt="" />
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-[#362A4A] dark:text-[#FBE4D8] text-[13px] truncate">{s.name}</h4>
                <p className="text-[#522B5B]/70 dark:text-[#DFB6B2]/70 text-[10px] font-bold">Lvl {s.level}</p>
              </div>
              <span className="font-black text-[14px] text-[#362A4A] dark:text-[#FBE4D8]">{s.xp.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="mt-auto pt-5 border-t border-black/5 dark:border-white/5 flex flex-col gap-2.5">
          {filteredStudents.map((s, i) => (
            <div key={i} className="flex-1 h-1.5 bg-gray-100 dark:bg-black/40 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${s.color} rounded-full`} style={{ width: `${(s.xp / (filteredStudents[0]?.xp || 1)) * 100}%` }} />
            </div>
          ))}
        </div>
      </Card>

      {/* ════════════════════════════════════════════════ */}
      {/* [DYNAMIC] Current Rank / Goal Card               */}
      {/* ════════════════════════════════════════════════ */}
      <Card className="dash-goal p-5 group">
        <div className="flex justify-between items-start mb-4">
          <div>
            <Label>Accuracy Goal</Label>
            <h2 className="text-[24px] font-black text-[#362A4A] dark:text-[#FBE4D8] leading-tight mt-2.5">
              {Number(data?.overall?.accuracy || 0)}%<br />
              <span className="text-amber-500 dark:text-amber-400">
                {Number(data?.overall.accuracy || 0) > 70 ? 'Elite Status' : 'Prodigy'}
              </span>
            </h2>
          </div>
          <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-amber-200 to-orange-300 shadow-lg flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
        </div>
        <div className="mt-3">
          <div className="w-full bg-gray-100 dark:bg-black/40 rounded-full h-[10px] p-[2.5px]">
            <div
              className="bg-gradient-to-r from-amber-200 to-orange-300 h-full rounded-full transition-all duration-1000"
              style={{ width: `${Number(data?.overall?.accuracy || 0)}%` }}
            />
          </div>
          <p className="text-[10px] text-center font-bold text-[#522B5B]/70 dark:text-[#DFB6B2]/50 mt-2.5 uppercase tracking-widest">
            Pulled from backend
          </p>
        </div>
      </Card>

      {/* ════════════════════════════════════════════════ */}
      {/* [TASK MANAGER] Fully Functional                  */}
      {/* ════════════════════════════════════════════════ */}
      <Card className="dash-reinforce p-5 flex flex-col relative overflow-hidden">
        <div className="flex justify-between items-center mb-5">
          <Label>Task Manager</Label>
          <button
            onClick={() => setIsAddingTask(!isAddingTask)}
            className={`p-1.5 rounded-lg transition-all ${isAddingTask ? 'bg-red-500 text-white' : 'bg-purple-100 dark:bg-white/5 text-purple-600'}`}
          >
            {isAddingTask ? <X size={16} /> : <PlusCircle size={16} />}
          </button>
        </div>

        {isAddingTask && (
          <form onSubmit={addTask} className="mb-4 animate-in slide-in-from-top-2">
            <input
              autoFocus
              type="text"
              placeholder="Add new task..."
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className="w-full h-10 bg-white dark:bg-black/40 border border-purple-500/30 rounded-xl px-4 text-[13px] font-bold outline-none focus:border-purple-500"
            />
          </form>
        )}

        <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${task.checked ? 'opacity-40 bg-gray-50' : 'bg-white/50 dark:bg-white/5 border-white dark:border-white/5'}`}
              onClick={() => toggleTask(task.id)}
            >
              <div className={`w-4 h-4 rounded border flex items-center justify-center ${task.checked ? 'bg-purple-500 border-purple-500' : 'border-purple-300'}`}>
                {task.checked && <CheckCircle2 size={10} className="text-white" />}
              </div>
              <span className={`text-[12px] font-bold flex-1 truncate ${task.checked ? 'line-through' : ''}`}>{task.name}</span>
              {task.checked && (
                <button onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} className="text-red-400 hover:text-red-600">
                  <Trash size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* ... Today's Challenges and Streak cards go here (same as before) ... */}

    </div>
  );
}