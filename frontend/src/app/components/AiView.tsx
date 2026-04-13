import { useState } from 'react';
import { apiFetch } from '../../api/client';
import {
  Sparkles, ChevronDown, Clock, BookOpen, Send,
  CheckCircle2, XCircle, ArrowRight, RotateCcw,
  Loader2, AlertCircle
} from 'lucide-react';

/* ─── Theme Colors ─── */
const COLORS = {
  primary: '#362A4A',
  secondary: '#522B5B',
  accent: '#854F6C',
  soft: '#DFB6B2',
  light: '#FBE4D8'
};

/* ─── Constants ─── */
const PRESET_TOPICS = [
  'Data Structures', 'Algorithms', 'Operating Systems',
  'Computer Networks', 'Database Systems', 'Discrete Mathematics',
  'Object Oriented Programming', 'Software Engineering',
  'Computer Architecture', 'Theory of Computation', 'Other'
];

const QUESTION_OPTIONS = [5, 10, 15, 20];

/* ─── Types ─── */
interface Question {
  question: string;
  options: string[];
  correct_answer: string;
}
type Phase = 'setup' | 'quiz' | 'results';

/* ─── Reusable Bubble Card (OLD STYLE) ─── */
function BubbleCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl rounded-tl-none bg-white dark:bg-white/5 border border-white/60 dark:border-white/5 shadow-sm p-6">
      {children}
    </div>
  );
}

/* ─── Main Component ─── */
export function AIView() {
  const [selectedTopic, setSelectedTopic] = useState('Data Structures');
  const [customTopic, setCustomTopic] = useState('');
  const [studyMinutes, setStudyMinutes] = useState(30);
  const [numQuestions, setNumQuestions] = useState(10);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [phase, setPhase] = useState<Phase>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [difficulty, setDifficulty] = useState('');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQ, setCurrentQ] = useState(0);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const effectiveTopic = selectedTopic === 'Other' ? customTopic.trim() : selectedTopic;

  /* ─── Generate ─── */
  const handleGenerate = async () => {
    if (!effectiveTopic) return setError('Enter topic');

    setLoading(true);
    try {
      const data = await apiFetch<any>('/api/generate-questions/', {
        method: 'POST',
        body: JSON.stringify({
          topic: effectiveTopic,
          number_of_questions: numQuestions,
          study_time: studyMinutes * 60,
        }),
      });

      setQuestions(data.questions);
      setDifficulty(data.difficulty);
      setAnswers({});
      setCurrentQ(0);
      setPhase('quiz');

    } catch {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  /* ─── Quiz Logic ─── */
  const selectAnswer = (ans: string) => {
    setAnswers(prev => ({ ...prev, [currentQ]: ans }));
  };

  const correctCount = questions.filter((q, i) => answers[i] === q.correct_answer).length;
  const score = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;

  /* =========================================================
     SETUP
  ========================================================= */
  if (phase === 'setup') return (
    <div className="max-w-[700px] mx-auto py-10 flex flex-col gap-6">

      {/* AI Message */}
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-2xl bg-[#362A4A] flex items-center justify-center">
          <Sparkles className="text-white w-4 h-4" />
        </div>
        <div className="bg-white dark:bg-white/5 rounded-3xl px-5 py-3 text-[13px] font-bold text-[#362A4A] dark:text-[#FBE4D8]">
          Tell me what you studied and for how long — I’ll test you 👀
        </div>
      </div>

      <BubbleCard>

        {/* Topic */}
        <div className="mb-6">
          <p className="text-sm font-bold text-[#522B5B]/50 mb-2">Topic</p>

          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full h-12 rounded-xl border border-[#522B5B]/20 px-4 flex justify-between items-center"
          >
            {selectedTopic}
            <ChevronDown />
          </button>

          {dropdownOpen && (
            <div className="mt-2 border rounded-xl bg-white dark:bg-[#2B124C]">
              {PRESET_TOPICS.map(t => (
                <div key={t} onClick={() => { setSelectedTopic(t); setDropdownOpen(false); }}
                  className="px-4 py-2 hover:bg-[#522B5B]/10 cursor-pointer">
                  {t}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Study Time */}
        <div className="mb-6">
          <p className="text-sm font-bold text-[#522B5B]/50 mb-2">Study Time</p>
          <input
            type="range"
            min={5} max={180}
            value={studyMinutes}
            onChange={(e) => setStudyMinutes(Number(e.target.value))}
            className="w-full accent-[#522B5B]"
          />
          <p>{studyMinutes} minutes</p>
        </div>

        {/* Questions */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {QUESTION_OPTIONS.map(n => (
            <button
              key={n}
              onClick={() => setNumQuestions(n)}
              className={`p-3 rounded-xl ${numQuestions === n
                  ? 'bg-[#362A4A] text-white'
                  : 'bg-[#522B5B]/10'
                }`}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Button */}
        <button
          onClick={handleGenerate}
          className="w-full h-12 rounded-xl bg-[#362A4A] text-white font-bold"
        >
          {loading ? 'Loading...' : 'Generate Quiz'}
        </button>

      </BubbleCard>
    </div>
  );

  /* =========================================================
     QUIZ
  ========================================================= */
  if (phase === 'quiz') {
    const q = questions[currentQ];

    return (
      <div className="max-w-[700px] mx-auto py-10 flex flex-col gap-6">

        <BubbleCard>
          <h2 className="font-bold mb-4">{q.question}</h2>

          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => selectAnswer(opt)}
              className={`w-full text-left p-3 rounded-xl mb-2 border ${answers[currentQ] === opt
                  ? 'bg-[#522B5B]/10 border-[#522B5B]'
                  : 'border-[#522B5B]/10'
                }`}
            >
              {opt}
            </button>
          ))}
        </BubbleCard>

        <div className="flex justify-between">
          <button onClick={() => setCurrentQ(q => q - 1)}>Prev</button>

          {currentQ < questions.length - 1 ? (
            <button onClick={() => setCurrentQ(q => q + 1)}>Next</button>
          ) : (
            <button onClick={() => setPhase('results')}>Submit</button>
          )}
        </div>

      </div>
    );
  }

  /* =========================================================
     RESULTS
  ========================================================= */
  return (
    <div className="max-w-[700px] mx-auto py-10 flex flex-col gap-6">

      <BubbleCard>
        <h1 className="text-3xl font-black">{score}%</h1>

        <p>
          {score >= 80 ? 'Excellent!' :
            score >= 50 ? 'Good Job!' :
              'Keep Practicing'}
        </p>

        <p>{correctCount}/{questions.length} correct</p>

        <button
          onClick={() => setPhase('setup')}
          className="mt-4 px-4 py-2 bg-[#362A4A] text-white rounded-xl"
        >
          New Quiz
        </button>
      </BubbleCard>

    </div>
  );
}