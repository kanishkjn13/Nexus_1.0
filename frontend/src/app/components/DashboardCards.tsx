import { Trophy, Zap, CheckCircle2, ChevronRight, MoreHorizontal, Gift, Link as LinkIcon, Target, Flame, PlusCircle, Trash, X } from 'lucide-react';
import { useState, useMemo } from 'react';

const INITIAL_STUDENTS = [
  { name: 'Lily K.', level: 7, xp: 1645, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily', rank: '🥇', top: true, color: 'from-amber-200 to-orange-300' },
  { name: 'Umar M.', level: 6, xp: 1350, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Umar', rank: '🥈', top: false, color: 'from-cyan-200 to-blue-300' },
  { name: 'Priya S.', level: 6, xp: 1235, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', rank: '🥉', top: false, color: 'from-purple-200 to-pink-300' },
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
  const [students] = useState(INITIAL_STUDENTS);

  // --- Task State ---
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Discrete Math Assignment', label: 'Urgent', time: '2h left', checked: false, priority: true },
    { id: 2, name: 'Research for Physics Lab', label: 'Draft', time: 'Tomorrow', checked: false },
    { id: 3, name: 'Email Professor Smith', label: 'Inquiry', time: 'Today', checked: true },
    { id: 4, name: 'Alg Quiz Prep', label: 'Review', time: 'Wed', checked: false }
  ]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');

  const urgentTask = useMemo(() => tasks.find(t => !t.checked && (t.priority || t.label === 'Urgent')) || tasks.find(t => !t.checked), [tasks]);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  const addTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTaskName.trim()) return;
    const newTask = {
      id: Date.now(),
      name: newTaskName,
      label: 'New',
      time: 'Just now',
      checked: false
    };
    setTasks([newTask, ...tasks]);
    setNewTaskName('');
    setIsAddingTask(false);
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const filteredStudents = useMemo(() => {
    return students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [students, searchQuery]);

  return (
    <div className="dash-grid mt-4 animate-in fade-in duration-700">

      {/* ════════════════════════════════════════════════ */}
      {/* [LARGE] Continue Studying — col left, 2 rows    */}
      {/* ════════════════════════════════════════════════ */}
      <Card className="dash-studying p-5 flex flex-col relative group">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
        <div className="flex justify-between items-center mb-4">

          <Label>Continue Studying</Label>
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => <div key={i} className="w-5 h-5 rounded-full border-2 border-white dark:border-[#2B124C] bg-gray-200 dark:bg-gray-800 overflow-hidden"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="user" /></div>)}
          </div>
        </div>

        <div className="mt-2 flex-1 flex flex-col">
          <div className="bg-gradient-to-br from-white/80 to-white/40 dark:from-[#190019]/80 dark:to-[#190019]/40 rounded-[20px] p-5 border border-white dark:border-white/5 shadow-inner flex flex-col gap-5 flex-1">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-200 to-blue-300 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="pt-0.5">
                <h4 className="text-[17px] font-black text-[#362A4A] dark:text-[#FBE4D8] leading-tight">Discrete Mathematics</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="px-1.5 py-0.5 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded text-[8px] font-black uppercase tracking-wider">Active</span>
                  <p className="text-[#522B5B]/70 dark:text-[#DFB6B2]/60 font-bold text-[9px] uppercase tracking-widest">Section 4: Set Theory</p>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <div className="flex justify-between text-[12px] font-black mb-1.5">
                <span className="text-[#522B5B]/70 dark:text-[#DFB6B2]/70">Overall Progress</span>
                <span className="text-cyan-500 dark:text-cyan-400 tracking-tighter">68%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-black/40 rounded-full h-[8px] p-[2px] shadow-inner">
                <div className="bg-gradient-to-r from-cyan-200 to-blue-300 h-full rounded-full w-[68%] transition-all duration-1000 shadow-[0_0_12px_rgba(34,211,238,0.4)]" />
              </div>
            </div>

            <button className="w-full h-10 bg-gradient-to-r from-cyan-200 to-blue-300 text-blue-900 dark:text-blue-50 font-black text-[13px] rounded-xl shadow-lg shadow-cyan-300/20 hover:scale-[0.98] active:scale-[0.96] transition-all flex justify-center items-center gap-2 group/btn">
              Resume Course <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </Card>

      {/* ════════════════════════════════════════════════ */}
      {/* [LARGE] Top Students — center col, 2 rows        */}
      {/* ════════════════════════════════════════════════ */}
      <Card className="dash-students p-5 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <Label>Global Leaderboard</Label>
          <div className="flex items-center gap-2 px-2.5 py-0.5 bg-amber-100 dark:bg-amber-500/10 rounded-full border border-amber-200 dark:border-amber-500/20">
            <Trophy className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
            <span className="text-[9px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">Live</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {filteredStudents.length > 0 ? filteredStudents.map((s, i) => (
            <div key={i} className={`flex items-center gap-2.5 p-2 rounded-[14px] cursor-pointer transition-all border ${i === 0 ? 'bg-gradient-to-r from-amber-50 to-white dark:from-amber-500/5 dark:to-transparent border-amber-200/50 dark:border-amber-500/10 shadow-sm' : 'hover:bg-black/2 dark:hover:bg-white/5 border-transparent'}`}>
              <span className={`text-[17px] w-5 text-center shrink-0 ${i === 0 ? 'drop-shadow-md' : 'opacity-40 grayscale'}`}>{s.rank}</span>
              <div className="relative">
                <img src={s.img} className={`w-8 h-8 rounded-full object-cover border-2 shadow-sm shrink-0 ${i === 0 ? 'border-amber-400' : 'border-white dark:border-[#2B124C]'}`} alt={s.name} />
                {i === 0 && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-amber-400 rounded-full flex items-center justify-center text-[6px] text-white font-black animate-bounce ring-1 ring-white dark:ring-[#190019]">🏆</span>}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-[#362A4A] dark:text-[#FBE4D8] text-[13px] truncate">{s.name}</h4>
                <p className="text-[#522B5B]/70 dark:text-[#DFB6B2]/70 text-[10px] font-bold">Lvl {s.level}</p>
              </div>
              <div className="text-right shrink-0">
                <span className={`font-black text-[15px] block ${i === 0 ? 'text-amber-600 dark:text-amber-400' : 'text-[#362A4A] dark:text-[#FBE4D8]'}`}>{s.xp.toLocaleString()}</span>
                <span className="text-[9px] text-[#522B5B]/60 dark:text-[#DFB6B2]/60 font-black tracking-widest uppercase">XP Points</span>
              </div>
            </div>
          )) : <div className="p-10 text-center text-gray-400 font-bold italic opacity-30">No results...</div>}
        </div>

        <div className="mt-auto pt-5 border-t border-black/5 dark:border-white/5 flex flex-col gap-2.5">
          {filteredStudents.map((s, i) => (
            <div key={i} className="flex items-center gap-2.5 group/bar">
              <span className="text-[10px] font-black text-[#522B5B]/60 dark:text-[#DFB6B2]/60 w-9 shrink-0 uppercase">{s.name.split(' ')[0]}</span>
              <div className="flex-1 h-1.5 bg-gray-100 dark:bg-black/40 rounded-full overflow-hidden shadow-inner">
                <div className={`h-full bg-gradient-to-r ${s.color} rounded-full transition-all duration-1000 group-hover/bar:brightness-110`} style={{ width: `${(s.xp / students[0].xp) * 100}%` }} />
              </div>
              <span className={`text-[11px] font-black w-9 text-right shrink-0 ${i === 0 ? 'text-amber-500' : 'text-[#522B5B]/70 dark:text-gray-300'}`}>{s.xp}</span>
            </div>
          ))}
        </div>
      </Card>


      {/* ════════════════════════════════════════════════ */}
      {/* [SMALL] Today's Challenges — top-right          */}
      {/* ════════════════════════════════════════════════ */}
      <Card className="dash-challenges p-4 relative group">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-pink-400/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
        <div className="flex justify-between items-center mb-3">
          <Label>Today's Challenges</Label>
          <span className="text-[8px] font-black text-pink-500 dark:text-pink-400 items-center flex gap-1 animate-pulse">
            <Flame className="w-2.5 h-2.5" /> HOT
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {[
            { emoji: '🧩', name: 'Logic Puzzle', xp: '+20 XP', color: 'text-purple-400', bg: 'bg-purple-100 dark:bg-purple-500/10' },
            { emoji: '⏱️', name: 'Quick Quiz', xp: '+10 XP', color: 'text-pink-500', bg: 'bg-pink-100 dark:bg-pink-500/10' },
            { emoji: '✅', name: 'Daily Goal', xp: '+10 XP', done: true }
          ].map((c, i) => (
            <div key={i} className={`flex items-center gap-2 p-2 rounded-[12px] transition-all cursor-pointer ${c.done ? 'opacity-40 grayscale bg-gray-100/50 dark:bg-black/20' : 'bg-white/70 dark:bg-[#190019]/60 border border-white/80 dark:border-white/5 shadow-sm hover:scale-[1.03] hover:shadow-md'}`}>
              <div className={`w-7 h-7 rounded-[9px] flex items-center justify-center text-base border border-white/20 dark:border-white/5 shrink-0 ${c.bg || 'bg-gray-100 dark:bg-gray-800'}`}>{c.emoji}</div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-black text-[12px] text-[#362A4A] dark:text-[#FBE4D8] truncate ${c.done ? 'line-through' : ''}`}>{c.name}</h4>
                <p className={`${c.color || 'text-gray-400'} text-[10px] font-black`}>{c.xp}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>


      {/* ════════════════════════════════════════════════ */}
      {/* [SMALL] Your Goal — mid-right                   */}
      {/* ════════════════════════════════════════════════ */}
      <Card className="dash-goal p-5 group">
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />
        <div className="flex justify-between items-start mb-4 leading-none">
          <div><Label>Current Rank</Label><h2 className="text-[24px] font-black text-[#362A4A] dark:text-[#FBE4D8] leading-tight mt-2.5">Top 3%<br /><span className="text-amber-500 dark:text-amber-400">Elite</span></h2></div>
          <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-amber-200 to-orange-300 shadow-lg shadow-amber-500/20 flex items-center justify-center shrink-0 hover:rotate-12 transition-transform"><Trophy className="w-6 h-6 text-white" /></div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-[11px] font-black mb-1.5"><span className="text-[#522B5B]/50 dark:text-[#DFB6B2]/50">XP Goal</span><span className="text-amber-500 font-black">72%</span></div>
          <div className="w-full bg-gray-100 dark:bg-black/40 rounded-full h-[10px] p-[2.5px] shadow-inner"><div className="bg-gradient-to-r from-amber-200 to-orange-300 h-full rounded-full w-[72%] relative flex items-center justify-end shadow-[0_0_10px_rgba(251,191,36,0.3)]"><div className="w-3.5 h-3.5 bg-white dark:bg-[#FBE4D8] rounded-full shadow-md mr-[-2px] shrink-0" /></div></div>
          <p className="text-[10px] text-center font-bold text-[#522B5B]/70 dark:text-[#DFB6B2]/50 mt-2.5 uppercase tracking-widest">Next: <span className="text-[#362A4A] dark:text-[#FBE4D8]">Legend</span></p>
        </div>
      </Card>

      {/* [LARGE] Task Management — third col, 2 rows      */}
      {/* ════════════════════════════════════════════════ */}
      <Card className="dash-reinforce p-5 flex flex-col relative overflow-hidden group">
        {/* Header */}
        <div className="flex justify-between items-center mb-5 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm border border-white dark:border-white/5">
              <Target size={16} />
            </div>
            <div>
              <h3 className="text-[15px] font-black text-[#362A4A] dark:text-[#FBE4D8] leading-none mb-0.5">Tasks</h3>
              <p className="text-[9px] uppercase font-bold text-[#522B5B]/60 dark:text-white/50 tracking-widest">{tasks.filter(t => !t.checked).length} Open • {tasks.length} Tot</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddingTask(!isAddingTask)}
            className={`p-1.5 rounded-lg transition-all shadow-sm ${isAddingTask ? 'bg-red-500 text-white animate-in spin-in-90' : 'bg-white/60 dark:bg-white/5 text-[#522B5B]/40 hover:text-purple-600'}`}
          >
            {isAddingTask ? <X size={18} /> : <PlusCircle size={18} />}
          </button>
        </div>

        {/* Add Task Input */}
        {isAddingTask && (
          <form onSubmit={addTask} className="mb-5 relative z-10 animate-in slide-in-from-top-2 duration-300">
            <input
              autoFocus
              type="text"
              placeholder="What needs to be done?"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className="w-full h-11 bg-white/80 dark:bg-black/40 border-2 border-purple-500/30 rounded-xl px-4 text-[13px] font-black text-[#362A4A] dark:text-[#FBE4D8] placeholder:text-[#522B5B]/20 dark:placeholder:text-white/10 outline-none focus:border-purple-500 transition-all shadow-xl"
            />
          </form>
        )}

        {/* Priority Task (Dynamic) */}
        {!isAddingTask && urgentTask && (
          <div className="mb-5 relative z-10">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-white to-[#F8F6FB] dark:from-[#2B124C] dark:to-[#190019] border border-white dark:border-white/5 shadow-lg shadow-purple-500/5 group/priority hover:scale-[1.02] transition-transform cursor-pointer relative overflow-hidden">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-ping" />
                  <span className="text-[8px] font-black uppercase text-red-500 tracking-wider">{(urgentTask as any).label === 'Urgent' ? 'Current Focus' : 'Next Up'}</span>
                </div>
                <span className="text-[9px] font-bold text-[#522B5B]/60 dark:text-white/40">{(urgentTask as any).time}</span>
              </div>
              <h4 className="text-[14px] font-black text-[#362A4A] dark:text-[#FBE4D8] mb-1.5">{(urgentTask as any).name}</h4>
              <div className="w-full h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden mb-2.5">
                <div className="h-full bg-gradient-to-r from-purple-400 to-pink-400 w-3/4 rounded-full" />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex -space-x-1">
                  {[1, 2, 3].map(i => <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=av${i}`} className="w-4 h-4 rounded-full border border-white dark:border-[#190019]" alt="av" />)}
                </div>
                <button
                  onClick={() => toggleTask((urgentTask as any).id)}
                  className="text-[10px] font-black text-purple-600 dark:text-purple-400 hover:scale-105 transition-transform"
                >
                  Complete →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task List (Dynamic) */}
        <div className="flex-1 space-y-2 relative z-10 overflow-y-auto no-scrollbar pr-1">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer group/item ${task.checked ? 'bg-black/2 dark:bg-white/2 border-transparent opacity-50' : 'bg-white/30 dark:bg-white/5 border-white dark:border-white/5 shadow-sm'}`}
              onClick={() => toggleTask(task.id)}
            >
              <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${task.checked ? 'bg-purple-500 border-purple-500' : 'border-purple-200 dark:border-white/10 group-hover/item:border-purple-400'}`}>
                {task.checked && <CheckCircle2 size={10} className="text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <h5 className={`text-[12px] font-bold text-[#362A4A] dark:text-[#FBE4D8] truncate ${task.checked ? 'line-through text-[#522B5B]/30' : ''}`}>{task.name}</h5>
              </div>
              {task.checked && (
                <button
                  onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                  className="opacity-0 group-hover/item:opacity-100 p-1 hover:text-red-500 transition-all"
                >
                  <Trash size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* ════════════════════════════════════════════════ */}
      {/* [SMALL] Streak — bottom-center                  */}
      {/* ════════════════════════════════════════════════ */}
      <Card className="dash-streak p-6 group">
        <div className="flex justify-between items-start mb-6">
          <div><Label>Active Streak</Label><div className="flex items-center gap-2 mt-3"><span className="px-3 py-1 bg-orange-100 dark:bg-orange-500/10 text-orange-500 dark:text-orange-400 rounded-full font-black text-[12px] border border-orange-200 uppercase tracking-widest">7 Days On Fire</span></div></div>
          <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-orange-200 to-red-300 shadow-lg shadow-orange-500/20 flex items-center justify-center shrink-0 group-hover:animate-bounce"><Flame className="w-6 h-6 text-white" /></div>
        </div>
        <div className="flex justify-around items-center gap-1 px-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className="text-[9px] font-black text-[#522B5B]/60 dark:text-gray-400 uppercase">{day}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-[14px] transition-all ${i <= 5 ? (i === 5 ? 'bg-gradient-to-br from-orange-200 to-red-300 text-white shadow-xl scale-110 ring-2 ring-white dark:ring-[#190019]' : 'bg-orange-100 dark:bg-orange-500/10 text-orange-400') : 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-700'}`}>
                {i < 5 ? <CheckCircle2 className="w-4 h-4" /> : day}
              </div>
            </div>
          ))}
        </div>
      </Card>



    </div>
  );
}
