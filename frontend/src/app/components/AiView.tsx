import React, { useState, useRef, useEffect } from 'react';
import {
  Bot, User, PlusCircle, MessageSquare, History,
  Trash2, Bookmark, Clock, AlertCircle,
  Trophy, RotateCcw, Send
} from 'lucide-react';
import api from '../../api/axios';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Question {
  question: string;
  options: string[];
  correct_answer: string;
}

type AppState = 'idle' | 'loading' | 'quiz' | 'submitting' | 'result';

interface QuizResult {
  score: number;
  total_questions: number;
  accuracy: number;
  timed_out: boolean;
  time_taken: number;
  time_limit: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseTimeToSeconds(input: string): number | null {
  const str = input.trim().toLowerCase();
  const hoursMatch = str.match(/^(\d+)\s*(h|hr|hrs|hour|hours)$/);
  const secsMatch = str.match(/^(\d+)\s*(s|sec|secs|second|seconds)$/);
  const minsMatch = str.match(/^(\d+)\s*(m|min|mins|minute|minutes)?$/);
  if (hoursMatch) return parseInt(hoursMatch[1]) * 3600;
  if (secsMatch) return parseInt(secsMatch[1]);
  if (minsMatch) return parseInt(minsMatch[1]) * 60;
  return null;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function formatStudyTime(seconds: number): string {
  if (seconds >= 3600) return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  if (seconds >= 60) return `${Math.floor(seconds / 60)}m`;
  return `${seconds}s`;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: 'text-emerald-500',
  medium: 'text-amber-500',
  hard: 'text-red-400',
};

// ─── Timer Bar ────────────────────────────────────────────────────────────────

function TimerBar({ timeLeft, timeLimit }: { timeLeft: number; timeLimit: number }) {
  const pct = (timeLeft / timeLimit) * 100;
  const isDanger = pct <= 20;
  const isWarn = pct <= 50 && pct > 20;
  return (
    <div className="flex items-center gap-3 px-6 py-3 border-b border-[#522B5B]/8 dark:border-white/5">
      <Clock
        size={14}
        className={isDanger ? 'text-red-400 animate-pulse' : isWarn ? 'text-amber-400' : 'text-[#854F6C]'}
      />
      <div className="flex-1 h-1.5 bg-[#522B5B]/10 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${isDanger ? 'bg-red-400' : isWarn ? 'bg-amber-400' : 'bg-[#854F6C]'
            }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-[12px] font-black tabular-nums ${isDanger ? 'text-red-400' : isWarn ? 'text-amber-500' : 'text-[#362A4A] dark:text-[#FBE4D8]'
        }`}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}

// ─── Chat Bubble ──────────────────────────────────────────────────────────────

function Bubble({ role, children, time }: {
  role: 'user' | 'assistant';
  children: React.ReactNode;
  time: Date;
}) {
  return (
    <div className={`flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-400 ${role === 'user' ? 'flex-row-reverse' : ''}`}>
      <div className={`w-9 h-9 rounded-2xl flex-shrink-0 flex items-center justify-center ${role === 'assistant'
        ? 'bg-[#362A4A] dark:bg-[#522B5B]'
        : 'bg-gradient-to-br from-[#854F6C] to-[#DFB6B2]'
        }`}>
        {role === 'assistant'
          ? <Bot size={16} className="text-white" />
          : <User size={16} className="text-white" />}
      </div>
      <div className={`max-w-[80%] flex flex-col ${role === 'user' ? 'items-end' : 'items-start'}`}>
        <div className={`px-5 py-4 rounded-3xl text-[14px] leading-relaxed ${role === 'assistant'
          ? 'bg-white dark:bg-white/5 text-[#362A4A] dark:text-[#FBE4D8] rounded-tl-none shadow-sm border border-white/60 dark:border-white/5'
          : 'bg-[#362A4A] dark:bg-[#522B5B] text-white rounded-tr-none'
          }`}>
          {children}
        </div>
        <span className="mt-1.5 text-[10px] font-bold text-[#522B5B]/30 dark:text-white/20 uppercase tracking-widest px-1">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

// ─── Quiz Bubble ──────────────────────────────────────────────────────────────

function QuizBubble({ question, index, total, selected, onSelect, onNext, onPrev, onSubmit, answeredCount }: {
  question: Question;
  index: number;
  total: number;
  selected: string | null;
  onSelect: (opt: string) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  answeredCount: number;
}) {
  const isLast = index === total - 1;
  return (
    <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
      <div className="w-9 h-9 rounded-2xl flex-shrink-0 flex items-center justify-center bg-[#362A4A] dark:bg-[#522B5B]">
        <Bot size={16} className="text-white" />
      </div>
      <div className="flex-1 max-w-[85%]">
        <div className="bg-white dark:bg-white/5 rounded-3xl rounded-tl-none border border-white/60 dark:border-white/5 shadow-sm overflow-hidden">

          <div className="px-5 pt-5 pb-3">
            <div className="flex gap-1 mb-3">
              {Array.from({ length: total }).map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i < index ? 'bg-[#854F6C] w-3'
                  : i === index ? 'bg-[#522B5B] w-5'
                    : 'bg-[#522B5B]/15 w-3'
                  }`} />
              ))}
            </div>
            <p className="text-[10px] font-black text-[#522B5B]/40 dark:text-[#DFB6B2]/40 uppercase tracking-widest mb-2">
              Question {index + 1} of {total}
            </p>
            <p className="text-[15px] font-bold text-[#362A4A] dark:text-[#FBE4D8] leading-snug">
              {question.question}
            </p>
          </div>

          <div className="px-5 pb-4 flex flex-col gap-2">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => onSelect(opt)}
                className={`text-left px-4 py-3 rounded-2xl text-[13px] font-bold border transition-all duration-200 ${selected === opt
                  ? 'border-[#522B5B] bg-[#522B5B]/8 text-[#362A4A] dark:text-[#FBE4D8]'
                  : 'border-[#522B5B]/10 dark:border-white/10 text-[#522B5B]/70 dark:text-[#DFB6B2]/60 hover:border-[#522B5B]/30 hover:bg-[#522B5B]/5'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="px-5 pb-5 flex items-center justify-between border-t border-[#522B5B]/5 dark:border-white/5 pt-3">
            <button
              onClick={onPrev}
              disabled={index === 0}
              className="px-4 py-2 rounded-xl text-[12px] font-black text-[#522B5B]/50 dark:text-[#DFB6B2]/40 border border-[#522B5B]/10 dark:border-white/10 hover:border-[#522B5B]/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            <span className="text-[11px] font-bold text-[#522B5B]/30 dark:text-white/20">
              {answeredCount}/{total} answered
            </span>
            {!isLast ? (
              <button
                onClick={onNext}
                className="px-4 py-2 rounded-xl text-[12px] font-black bg-[#362A4A] dark:bg-[#522B5B] text-white hover:opacity-90 transition-all"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={onSubmit}
                className="px-4 py-2 rounded-xl text-[12px] font-black bg-[#854F6C] text-white hover:opacity-90 transition-all"
              >
                Submit ✓
              </button>
            )}
          </div>
        </div>
        <span className="mt-1.5 text-[10px] font-bold text-[#522B5B]/30 dark:text-white/20 uppercase tracking-widest px-1">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

// ─── Result Bubble ────────────────────────────────────────────────────────────

function ResultBubble({ result, topic, onRestart }: {
  result: QuizResult;
  topic: string;
  onRestart: () => void;
}) {
  const { score, total_questions, accuracy, timed_out, time_taken, time_limit } = result;
  const label = timed_out ? "Time's up!"
    : accuracy >= 80 ? 'Excellent work!'
      : accuracy >= 50 ? 'Good job!'
        : 'Keep practicing!';

  return (
    <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-400">
      <div className="w-9 h-9 rounded-2xl flex-shrink-0 flex items-center justify-center bg-[#362A4A] dark:bg-[#522B5B]">
        <Trophy size={16} className="text-white" />
      </div>
      <div className="flex-1 max-w-[85%]">
        <div className="bg-white dark:bg-white/5 rounded-3xl rounded-tl-none border border-white/60 dark:border-white/5 shadow-sm p-5">

          <p className="text-[15px] font-black text-[#362A4A] dark:text-[#FBE4D8] mb-1">{label}</p>
          <p className="text-[12px] text-[#522B5B]/50 dark:text-[#DFB6B2]/40 mb-4">
            Topic: <span className="font-bold text-[#522B5B] dark:text-[#DFB6B2] capitalize">{topic}</span>
          </p>

          {timed_out && (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl px-4 py-2.5 mb-4">
              <AlertCircle size={13} className="text-red-400 flex-shrink-0" />
              <p className="text-[12px] font-bold text-red-400">Time limit exceeded — score recorded as 0</p>
            </div>
          )}

          <div className="flex items-center gap-5 mb-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#F3EFF5" strokeWidth="7" />
                <circle cx="40" cy="40" r="32" fill="none"
                  stroke={timed_out ? '#f87171' : accuracy >= 80 ? '#4ade80' : accuracy >= 50 ? '#fbbf24' : '#854F6C'}
                  strokeWidth="7"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - accuracy / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[15px] font-black text-[#362A4A] dark:text-[#FBE4D8]">{Math.round(accuracy)}%</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              {[
                { label: 'Score', value: `${score} / ${total_questions}` },
                { label: 'Time taken', value: formatStudyTime(time_taken) },
                { label: 'Time limit', value: formatStudyTime(time_limit) },
              ].map((s, i) => (
                <div key={i} className="flex justify-between items-center text-[12px]">
                  <span className="text-[#522B5B]/50 dark:text-[#DFB6B2]/40 font-bold">{s.label}</span>
                  <span className="font-black text-[#362A4A] dark:text-[#FBE4D8]">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onRestart}
            className="flex items-center gap-2 w-full justify-center py-3 rounded-2xl bg-[#362A4A] dark:bg-[#522B5B] text-white font-black text-[13px] hover:opacity-90 transition-all"
          >
            <RotateCcw size={14} />
            Try another topic
          </button>
        </div>
        <span className="mt-1.5 text-[10px] font-bold text-[#522B5B]/30 dark:text-white/20 uppercase tracking-widest px-1">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────

export function AiView() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [topic, setTopic] = useState('');
  const [studyTime, setStudyTime] = useState('');
  const [timeError, setTimeError] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [timeLimit, setTimeLimit] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [msgTime] = useState(new Date());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Scroll chat area only (not page) ──────────────────────────────────────
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTo({
        top: chatAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [appState, currentIndex, errorMsg]);;

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = (seconds: number) => {
    setTimeLeft(seconds);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          stopTimer();
          setTimeout(() => handleSubmit(true), 0); // ✅ FIX
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  useEffect(() => () => stopTimer(), []);

  // ── Generate ───────────────────────────────────────────────────────────────

  const handleGenerate = async (e?: React.MouseEvent) => {
    e?.preventDefault();

    if (!topic.trim() || !studyTime.trim()) return;

    setTimeError('');
    setErrorMsg('');

    const studySeconds = parseTimeToSeconds(studyTime);
    if (!studySeconds) {
      setTimeError('Try: 30m, 1h, 90s');
      return;
    }

    setAppState('loading');

    try {
      const res = await api.post('/proofly/generate-questions/', {  // ✅ adjust if needed
        topic: topic.trim(),
        number_of_questions: 5,
        study_time: studySeconds,
      });

      if (!res.data.questions || res.data.questions.length === 0) {
        throw new Error('No questions received');
      }

      const qs: Question[] = res.data.questions;
      const quizLimit: number = res.data.time_limit;
      const diff: string = res.data.difficulty;

      setQuestions(qs);
      setAnswers(new Array(qs.length).fill(null));
      setCurrentIndex(0);
      setDifficulty(diff);
      setTimeLimit(quizLimit);
      setStartTime(Date.now());
      setAppState('quiz');

      startTimer(quizLimit);

    } catch (err: any) {
      console.error(err); // ✅ DEBUG
      setErrorMsg(
        err?.response?.data?.detail ||
        err?.response?.data?.error ||
        'Server not reachable'
      );
      setAppState('idle');
    }
  };
  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (timedOut = false) => {
    if (appState !== 'quiz') return;

    stopTimer();
    setAppState('submitting');

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    const score = timedOut
      ? 0
      : answers.reduce((acc, ans, i) =>
        acc + (ans === questions[i].correct_answer ? 1 : 0), 0
      );

    try {
      const res = await api.post('/sessions/', {
        topic: topic.trim(),
        score,
        total_questions: questions.length,
        time_limit: timeLimit,
        time_taken: timeTaken,
      });

      const totalQ = res.data.total_questions || 0;

      setResult({
        score: res.data.score,
        total_questions: totalQ,
        accuracy: totalQ > 0 ? (res.data.score / totalQ) * 100 : 0, // ✅ FIX
        timed_out: res.data.timed_out,
        time_taken: timeTaken,
        time_limit: timeLimit,
      });

    } catch (err) {
      console.error(err); // ✅ DEBUG

      const totalQ = questions.length || 0;

      setResult({
        score,
        total_questions: totalQ,
        accuracy: totalQ > 0 ? (score / totalQ) * 100 : 0, // ✅ FIX
        timed_out: timedOut,
        time_taken: timeTaken,
        time_limit: timeLimit,
      });
    } finally {
      setAppState('result');
    }
  };

  // ── Restart ────────────────────────────────────────────────────────────────

  const handleRestart = () => {
    stopTimer();

    setAppState('idle');
    setTopic('');
    setStudyTime('');
    setDifficulty('');
    setQuestions([]);
    setAnswers([]);
    setResult(null);
    setErrorMsg('');
    setTimeError('');
  };
  const canSend = topic.trim() !== '' && studyTime.trim() !== '' && appState === 'idle';

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col lg:flex-row bg-white/40 dark:bg-[#2B124C]/30 backdrop-blur-3xl rounded-[1.5rem] md:rounded-[2.5rem] border border-white/40 dark:border-white/5 overflow-hidden h-[85vh] shadow-[0_20px_50px_rgba(0,0,0,0.08)]">

      {/* ── Sidebar ── */}
      <div className="hidden lg:flex w-[280px] border-r border-[#522B5B]/10 dark:border-white/5 p-6 flex-col bg-[#F8F5FA] dark:bg-black/20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-[#362A4A] flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <p className="font-black text-[14px] text-[#362A4A] dark:text-[#FBE4D8]">Proofly AI</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-wider">Online</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#362A4A] dark:bg-[#FBE4D8] text-white dark:text-[#190019] rounded-2xl font-black text-[13px] hover:opacity-90 transition-all mb-6"
        >
          <PlusCircle size={16} />
          New Session
        </button>

        {/* Difficulty badge — shows during quiz */}
        {difficulty && (
          <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#362A4A]/5 dark:bg-white/5 border border-[#362A4A]/10 dark:border-white/10">
            <span className="text-[10px] font-black text-[#522B5B]/40 dark:text-white/30 uppercase tracking-widest">Difficulty</span>
            <span className={`text-[12px] font-black uppercase ${DIFFICULTY_STYLES[difficulty] || 'text-purple-500'}`}>
              {difficulty}
            </span>
          </div>
        )}

        <p className="text-[10px] font-black text-[#522B5B]/40 dark:text-white/30 uppercase tracking-[0.2em] mb-3">How it works</p>
        <div className="space-y-3">
          {[
            { step: '1', text: 'Enter what you studied' },
            { step: '2', text: 'Enter how long you studied' },
            { step: '3', text: 'Answer 5 AI-generated questions' },
            { step: '4', text: 'See your score & save session' },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-[#362A4A]/10 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-black text-[#362A4A] dark:text-[#FBE4D8]">{step}</span>
              </div>
              <p className="text-[12px] font-bold text-[#522B5B]/60 dark:text-[#DFB6B2]/50">{text}</p>
            </div>
          ))}
        </div>

        {/* Difficulty legend */}
        <div className="mt-auto pt-6 border-t border-[#522B5B]/8 dark:border-white/5">
          <p className="text-[10px] font-black text-[#522B5B]/40 dark:text-white/30 uppercase tracking-[0.2em] mb-3">Difficulty guide</p>
          <div className="space-y-2">
            {[
              { level: 'Easy', time: '< 30 mins', color: 'text-emerald-500' },
              { level: 'Medium', time: '30 min – 2h', color: 'text-amber-500' },
              { level: 'Hard', time: '> 2 hours', color: 'text-red-400' },
            ].map(({ level, time, color }) => (
              <div key={level} className="flex items-center justify-between text-[11px]">
                <span className={`font-black ${color}`}>{level}</span>
                <span className="text-[#522B5B]/40 dark:text-white/20 font-bold">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main chat area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="px-6 md:px-8 py-4 flex items-center justify-between border-b border-[#522B5B]/8 dark:border-white/5 bg-white/30 dark:bg-transparent">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#522B5B]/10 dark:bg-white/10 flex items-center justify-center">
              <History size={16} className="text-[#522B5B] dark:text-[#DFB6B2]" />
            </div>
            <div>
              <p className="font-black text-[15px] text-[#362A4A] dark:text-[#FBE4D8]">Chat session</p>
              {/* ✅ Difficulty shown in header during quiz */}
              <p className="text-[11px] text-[#522B5B]/40 dark:text-white/30">
                {appState === 'idle' ? 'Academic Mode'
                  : appState === 'loading' ? 'Generating questions...'
                    : appState === 'quiz' ? (
                      <span>
                        Quiz · {topic}
                        {difficulty && (
                          <span className={`ml-2 font-black uppercase ${DIFFICULTY_STYLES[difficulty]}`}>
                            · {difficulty}
                          </span>
                        )}
                      </span>
                    )
                      : appState === 'submitting' ? 'Saving session...'
                        : 'Session complete'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-xl hover:bg-[#522B5B]/5 text-[#522B5B]/40 dark:text-white/30 transition-all">
              <Bookmark size={16} />
            </button>
            <button
              onClick={handleRestart}
              className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-[#522B5B]/40 dark:text-red-400 transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Timer */}
        {appState === 'quiz' && (
          <TimerBar timeLeft={timeLeft} timeLimit={timeLimit} />
        )}

        {/* Messages — scrolls independently, page never scrolls */}
        <div
          ref={chatAreaRef}
          className="flex-1 overflow-y-auto px-6 md:px-8 py-6 no-scrollbar"
        >
          <div className="max-w-3xl mx-auto space-y-6">

            <Bubble role="assistant" time={msgTime}>
              Hello! I'm Proofly AI. Tell me what you studied and for how long — I'll generate questions based on your study depth!
            </Bubble>

            {(appState === 'loading' || appState === 'submitting') && (
              <Bubble role="assistant" time={new Date()}>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-[#854F6C] rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-[#854F6C] rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-[#854F6C] rounded-full animate-bounce" />
                  </div>
                  <span className="text-[13px] text-[#522B5B]/60 dark:text-[#DFB6B2]/50 font-bold">
                    {appState === 'loading'
                      ? `Generating ${difficulty || ''} questions on "${topic}"...`
                      : 'Saving your session...'}
                  </span>
                </div>
              </Bubble>
            )}

            {(appState === 'quiz' || appState === 'submitting' || appState === 'result') && (
              <Bubble role="user" time={new Date()}>
                I studied <strong>{topic}</strong> for <strong>{studyTime}</strong> — quiz me!
              </Bubble>
            )}

            {appState === 'quiz' && questions.length > 0 && (
              <QuizBubble
                question={questions[currentIndex]}
                index={currentIndex}
                total={questions.length}
                selected={answers[currentIndex]}
                onSelect={(opt) => setAnswers(prev => {
                  const u = [...prev]; u[currentIndex] = opt; return u;
                })}
                onNext={() => setCurrentIndex(p => Math.min(p + 1, questions.length - 1))}
                onPrev={() => setCurrentIndex(p => Math.max(p - 1, 0))}
                onSubmit={() => handleSubmit(false)}
                answeredCount={answers.filter(Boolean).length}
              />
            )}

            {appState === 'result' && result && (
              <ResultBubble result={result} topic={topic} onRestart={handleRestart} />
            )}

            {errorMsg && (
              <Bubble role="assistant" time={new Date()}>
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                  <span className="text-[13px] text-red-400 font-bold">{errorMsg}</span>
                </div>
              </Bubble>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ── Input bar ── */}
        <div className="px-4 md:px-6 pb-4 md:pb-6 pt-3">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/80 dark:bg-[#190019]/80 backdrop-blur-xl border border-[#522B5B]/10 dark:border-white/10 rounded-[1.5rem] p-2.5 shadow-sm">

              <div className="flex gap-2 px-3 pb-2.5 border-b border-[#522B5B]/6 dark:border-white/5">
                <div className="flex-1 flex items-center gap-2">
                  <MessageSquare size={12} className="text-[#522B5B]/30 dark:text-white/20 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="What did you study?"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && canSend && handleGenerate()}
                    disabled={appState !== 'idle'}
                    className="w-full bg-transparent border-none outline-none text-[12px] font-black text-[#362A4A] dark:text-white placeholder-[#522B5B]/30 dark:placeholder-white/20 disabled:opacity-40"
                  />
                </div>
                <div className="w-px h-4 bg-[#522B5B]/10 self-center" />
                <div className="flex items-center gap-2 w-40">
                  <Clock size={12} className="text-[#522B5B]/30 dark:text-white/20 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="How long? (30m, 1h)"
                    value={studyTime}
                    onChange={(e) => { setStudyTime(e.target.value); setTimeError(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && canSend && handleGenerate()}
                    disabled={appState !== 'idle'}
                    className="w-full bg-transparent border-none outline-none text-[12px] font-black text-[#362A4A] dark:text-white placeholder-[#522B5B]/30 dark:placeholder-white/20 disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 px-1">
                <div className="flex-1">
                  <span className="px-2 py-2 text-[12px] font-bold text-[#522B5B]/30 dark:text-white/20">
                    {timeError ? (
                      <span className="text-red-400">{timeError}</span>
                    ) : appState === 'idle' ? 'Enter topic & study time, then hit send'
                      : appState === 'loading' ? 'Generating questions...'
                        : appState === 'quiz' ? `Question ${currentIndex + 1} of ${questions.length} · 10 min quiz`
                          : appState === 'submitting' ? 'Saving your session...'
                            : 'Quiz complete! Start a new session anytime.'}
                  </span>
                </div>
                <button
                  onClick={(e) => { e.preventDefault(); handleGenerate(); }} // ✅ no page scroll
                  disabled={!canSend}
                  className="w-11 h-11 rounded-2xl bg-[#362A4A] dark:bg-[#522B5B] text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                >
                  <Send size={16} fill="currentColor" className="ml-0.5" />
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
} 