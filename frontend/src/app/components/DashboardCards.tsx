import React from "react";
import {
  Trophy, CheckCircle2, Target, Flame, Trash2,
  PlusCircle, Trash, X, Play, Square, RefreshCw, Clock
} from 'lucide-react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useProgress } from '../../hooks/useProgress';

// ─── Sub-Components ──────────────────────────────────────────────────────────

function Card({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-white/40 dark:bg-[#2B124C]/40 backdrop-blur-xl rounded-[24px] border border-white/60 dark:border-white/10 shadow-sm transition-all hover:shadow-xl hover:translate-y-[-2px] duration-300 ${className}`}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-[10px] font-black text-[#522B5B]/50 dark:text-[#DFB6B2]/50 uppercase tracking-[0.2em] leading-none">{children}</span>;
}

// ─── Static Data ─────────────────────────────────────────────────────────────

const INITIAL_STUDENTS = [
  { name: 'Lily K.', level: 7, xp: 1645, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily', rank: '🥇', color: 'from-amber-200 to-orange-300' },
  { name: 'Umar M.', level: 6, xp: 1350, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Umar', rank: '🥈', color: 'from-cyan-200 to-blue-300' },
  { name: 'Priya S.', level: 6, xp: 1235, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', rank: '🥉', color: 'from-purple-200 to-pink-300' },
];

const STREAK_DAYS = [
  { day: 'Mon', completed: true },
  { day: 'Tue', completed: true },
  { day: 'Wed', completed: true },
  { day: 'Thu', completed: true },
  { day: 'Fri', completed: false, isToday: true },
  { day: 'Sat', completed: false },
  { day: 'Sun', completed: false },
];

// ─── Main Component ──────────────────────────────────────────────────────────

export function DashboardCards({ searchQuery = '' }) {
  const { data } = useProgress();

  // --- Timer State ---
  const [inputMinutes, setInputMinutes] = useState(25);
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Task Manager State ---
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Discrete Math Assignment', checked: false },
    { id: 2, name: 'Research for Physics Lab', checked: false },
    { id: 3, name: 'Email Professor Smith', checked: true },
  ]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');

  // 1. Sync display with input (only when not active)
  useEffect(() => {
    if (!isActive) {
      setSeconds(inputMinutes * 60);
    }
  }, [inputMinutes, isActive]);

  // 2. Timer Logic
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    setTasks([{ id: Date.now(), name: newTaskName, checked: false }, ...tasks]);
    setNewTaskName('');
    setIsAddingTask(false);
  };

  const filteredStudents = INITIAL_STUDENTS.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 animate-in fade-in duration-700">

      {/* ─── TIMER CARD ─── */}
      <Card className="p-6 flex flex-col relative group overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="flex justify-between items-center mb-4">
          <Label>Focus Timer</Label>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative py-4">
          {/* Circular Progress Timer */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="74"
                fill="none"
                stroke="currentColor"
                className="text-black/5 dark:text-white/5"
                strokeWidth="3"
              />
              <circle
                cx="80"
                cy="80"
                r="74"
                fill="none"
                stroke="currentColor"
                className="text-[#522B5B] dark:text-[#DFB6B2] transition-all duration-1000 ease-linear"
                strokeWidth="3"
                strokeDasharray="465"
                strokeDashoffset={465 - (465 * (inputMinutes > 0 ? (seconds / (inputMinutes * 60)) : 0))}
                strokeLinecap="round"
              />
            </svg>
            <div className="flex flex-col items-center justify-center z-10 w-full">
              {!isActive ? (
                <input
                  type="number"
                  value={inputMinutes === 0 ? '' : inputMinutes}
                  placeholder="25"
                  onChange={(e) => {
                    const val = e.target.value;
                    setInputMinutes(val === '' ? 0 : Math.max(1, parseInt(val) || 0));
                  }}
                  onBlur={() => { if (!inputMinutes || inputMinutes <= 0) setInputMinutes(25); }}
                  title="Set minutes"
                  className="w-[100px] bg-transparent text-center text-[48px] font-black text-[#362A4A] dark:text-[#FBE4D8] outline-none transition-all placeholder:text-[#362A4A]/20 dark:placeholder:text-[#FBE4D8]/20 tabular-nums z-10 selection:bg-[#522B5B]/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              ) : (
                <div className="text-[48px] font-black text-[#362A4A] dark:text-[#FBE4D8] tracking-tighter tabular-nums z-10">
                  {formatTime(seconds)}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-4 w-full mt-10 relative z-10 px-2">
            <button
              onClick={() => setIsActive(!isActive)}
              disabled={seconds === 0}
              className={`flex-1 h-12 rounded-2xl font-black text-[13px] flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 ${isActive ? 'bg-red-50 text-red-500 dark:bg-red-500/20 dark:text-red-400' : 'bg-[#522B5B] text-white dark:bg-[#DFB6B2] dark:text-[#190019]'
                }`}
            >
              {isActive ? <Square size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
              {isActive ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={() => { setIsActive(false); setSeconds(inputMinutes * 60); }}
              className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#522B5B] dark:hover:text-[#FBE4D8] transition-colors"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </Card>

      {/* ─── MASTERY RANKING ─── */}
      <Card className="p-5 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <Label>Mastery Ranking</Label>
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
        </div>
        <div className="space-y-4">
          {filteredStudents.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs font-black opacity-30 w-4">{i + 1}</span>
              <img src={s.img} className="w-8 h-8 rounded-full bg-gray-200" alt="" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-1">
                  <h4 className="font-black text-[12px] text-[#362A4A] dark:text-[#FBE4D8] truncate">{s.name}</h4>
                  <span className="text-[10px] font-black text-[#854F6C] dark:text-[#DFB6B2]">{s.xp} XP</span>
                </div>
                <div className="w-full h-1 bg-black/5 dark:bg-white/5 rounded-full">
                  <div className={`h-full bg-gradient-to-r ${s.color} rounded-full`} style={{ width: '70%' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ─── TASK MANAGER ─── */}
      <Card className="p-5 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <Label>Daily Tasks</Label>
          <button onClick={() => setIsAddingTask(!isAddingTask)} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors">
            {isAddingTask ? <X size={16} /> : <PlusCircle size={16} className="text-[#522B5B] dark:text-[#DFB6B2]" />}
          </button>
        </div>
        {isAddingTask && (
          <form onSubmit={addTask} className="mb-3">
            <input
              autoFocus
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Enter task..."
              className="w-full h-9 bg-black/5 dark:bg-white/5 border-none rounded-xl px-3 text-xs font-bold outline-none ring-1 ring-[#522B5B]/20 dark:ring-[#DFB6B2]/20 focus:ring-[#522B5B]/50 dark:focus:ring-[#DFB6B2]/50 text-[#362A4A] dark:text-[#FBE4D8]"
            />
          </form>
        )}
        <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center gap-3 p-3 rounded-2xl transition-all group ${task.checked ? 'opacity-50' : 'bg-white/50 dark:bg-white/5 hover:scale-[1.02]'}`}
            >
              <div 
                className={`w-4 h-4 rounded-md border-2 flex items-center justify-center cursor-pointer transition-colors ${task.checked ? 'bg-[#522B5B] border-[#522B5B] dark:bg-[#DFB6B2] dark:border-[#DFB6B2]' : 'border-[#522B5B]/30 dark:border-[#DFB6B2]/30'}`}
                onClick={() => setTasks(tasks.map(t => t.id === task.id ? { ...t, checked: !t.checked } : t))}
              >
                {task.checked && <CheckCircle2 size={10} className="text-white dark:text-[#190019]" />}
              </div>
              <span 
                className={`text-xs font-bold truncate flex-1 cursor-pointer transition-all text-[#362A4A] dark:text-[#FBE4D8] ${task.checked ? 'line-through opacity-70' : ''}`}
                onClick={() => setTasks(tasks.map(t => t.id === task.id ? { ...t, checked: !t.checked } : t))}
              >
                {task.name}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); setTasks(tasks.filter(t => t.id !== task.id)); }}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* ─── ACCURACY GOAL ─── */}
      <Card className="p-6 flex flex-col justify-center">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <Label>Overall Accuracy</Label>
            <h2 className="text-4xl font-black text-[#362A4A] dark:text-[#FBE4D8]">
              {data?.overall?.accuracy || 0}%
            </h2>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#522B5B]/10 dark:bg-[#DFB6B2]/10 flex items-center justify-center text-[#522B5B] dark:text-[#DFB6B2]">
            <Target size={24} />
          </div>
        </div>
        <div className="mt-6">
          <div className="w-full h-3 bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#522B5B] to-[#854F6C] dark:from-[#DFB6B2] dark:to-[#FBE4D8] transition-all duration-1000"
              style={{ width: `${data?.overall?.accuracy || 0}%` }}
            />
          </div>
        </div>
      </Card>

      {/* ─── STREAK MANAGER (LG SPAN 2) ─── */}
      <Card className="lg:col-span-2 p-6 group relative overflow-hidden">
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <Label>Weekly Activity Streak</Label>
            <div className="flex items-center gap-2">
              <span className="text-4xl font-black text-[#362A4A] dark:text-[#FBE4D8]">12</span>
              <div className="flex flex-col">
                <span className="text-[12px] font-black text-orange-500 leading-none uppercase">Day</span>
                <span className="text-[12px] font-black text-orange-500 leading-none uppercase tracking-tight">Fire</span>
              </div>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 shadow-lg flex items-center justify-center">
            <Flame className="w-7 h-7 text-white" fill="currentColor" />
          </div>
        </div>

        <div className="flex justify-between items-end h-24 gap-3 px-2">
          {STREAK_DAYS.map((day, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-3">
              <span className={`text-[11px] font-black uppercase ${day.isToday ? 'text-orange-500' : 'text-gray-400'}`}>
                {day.day}
              </span>
              <div className={`w-full max-w-[50px] rounded-2xl transition-all duration-500 flex items-center justify-center ${day.completed
                ? 'h-16 bg-gradient-to-b from-[#522B5B] to-[#854F6C] dark:from-[#DFB6B2] dark:to-[#FBE4D8] shadow-md shadow-[#522B5B]/20 dark:shadow-[#DFB6B2]/20'
                : day.isToday
                  ? 'h-12 bg-white dark:bg-white/5 border-2 border-dashed border-[#522B5B]/50 dark:border-[#DFB6B2]/50'
                  : 'h-10 bg-black/5 dark:bg-white/5'
                }`}>
                {day.completed ? (
                  <CheckCircle2 size={18} className="text-white dark:text-[#190019]" />
                ) : day.isToday ? (
                  <div className="w-2 h-2 bg-[#522B5B] dark:bg-[#DFB6B2] rounded-full animate-ping" />
                ) : (
                  <div className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}