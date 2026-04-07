import React, { useState } from 'react';
import {
  Trophy, Flame, Star, CheckCircle2, Globe, Clock,
  ChevronRight, Puzzle, Zap, ChevronLeft, ChevronDown,
  List, Sigma, Lightbulb, HelpCircle, BookOpen, Crown
} from 'lucide-react';

export function ChallengesView() {
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <div className="w-full text-white font-sans animate-in fade-in slide-in-from-bottom-5 duration-500 pb-10">
      {/* HEADER */}
        {/* Header Text */}
        <div className="z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight dark:text-white text-[#362A4A]">
            Challenges
          </h1>
          <p className="text-gray-500 dark:text-gray-300 text-lg max-w-md">
            Push your limits, earn XP, and unlock new achievements!
          </p>
        </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { title: "Active Streak", value: "7 days", sub: "Keep it going!", icon: Flame, color: "bg-orange-500", text: "text-orange-500" },
          { title: "XP Earned", value: "12,840", sub: "from last week", greenSub: " ▴ 12.5%", icon: Star, color: "bg-purple-500", text: "text-purple-500" },
          { title: "Challenges Completed", value: "24", sub: "This month", greenSub: " +8", icon: CheckCircle2, color: "bg-teal-500", text: "text-teal-500" },
          { title: "Global Rank", value: "Top 5%", sub: "of all learners", icon: Globe, color: "bg-indigo-500", text: "text-indigo-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white/80 dark:bg-[#1a1226]/80 backdrop-blur-md rounded-2xl p-5 border border-purple-100 dark:border-white/5 flex items-center gap-4 hover:bg-purple-50/50 dark:hover:bg-white/5 transition-all duration-300 cursor-default shadow-lg shadow-black/10 group hover:scale-[1.02]">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-white/5`}>
              <stat.icon className={`w-7 h-7 ${stat.text} fill-current`} strokeWidth={1} />
            </div>
            <div>
              <p className="text-gray-400 text-sm font-medium mb-0.5">{stat.title}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold dark:text-white text-[#1f172a]">{stat.value}</h3>
              </div>
              <p className="text-gray-500 text-xs mt-1">
                {stat.sub}
                {stat.greenSub && <span className="text-teal-400 ml-1">{stat.greenSub}</span>}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        {/* TODAY'S CHALLENGES */}
        <div className="lg:col-span-3 bg-white/80 dark:bg-[#1a1226]/80 backdrop-blur-md rounded-2xl p-6 border border-purple-100 dark:border-white/5 shadow-lg shadow-black/10 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold dark:text-white text-[#1f172a]">Today's Challenges</h2>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                Refreshes in 12h 30m
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3 gap-4 flex-1">
            {/* Logic Puzzle */}
            <div className="bg-purple-50/80 dark:bg-[#2d2249] rounded-2xl p-5 border border-purple-200 dark:border-purple-500/20 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
                  <Puzzle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1 dark:text-white text-gray-900">Logic Puzzle</h3>
                  <p className="text-xs text-purple-900/60 dark:text-gray-400 leading-relaxed max-w-[150px]">Solve a tricky discrete math problem.</p>
                </div>
              </div>
              <div className="mt-auto">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-bold text-sm text-purple-600 dark:text-purple-300">+20 XP</span>
                  <span className="text-xs text-purple-900/50 dark:text-gray-400">0/1</span>
                </div>
                <div className="w-full h-1.5 bg-purple-200 dark:bg-black/30 rounded-full mb-5">
                  <div className="h-full bg-purple-500 rounded-full w-0" />
                </div>
                <button className="w-full py-2.5 bg-purple-100 dark:bg-purple-500/20 hover:bg-purple-200 dark:hover:bg-purple-500/30 text-purple-700 dark:text-purple-300 text-sm font-semibold rounded-xl transition-colors">
                  Start Challenge
                </button>
              </div>
            </div>

            {/* Quick Quiz */}
            <div className="bg-orange-50/80 dark:bg-[#302029] rounded-2xl p-5 border border-orange-200 dark:border-orange-500/20 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1 dark:text-white text-gray-900">Quick Quiz</h3>
                  <p className="text-xs text-orange-900/60 dark:text-gray-400 leading-relaxed max-w-[150px]">Answer 5 correctly, consecutively.</p>
                </div>
              </div>
              <div className="mt-auto">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-bold text-sm text-orange-600 dark:text-orange-300">+10 XP</span>
                  <span className="text-xs text-orange-900/50 dark:text-gray-400">2/5</span>
                </div>
                <div className="w-full h-1.5 bg-orange-200 dark:bg-black/30 rounded-full mb-5">
                  <div className="h-full bg-orange-500 rounded-full w-[40%]" />
                </div>
                <button className="w-full py-2.5 bg-orange-100 dark:bg-orange-500/20 hover:bg-orange-200 dark:hover:bg-orange-500/30 text-orange-700 dark:text-orange-300 text-sm font-semibold rounded-xl transition-colors">
                  Continue
                </button>
              </div>
            </div>

            {/* Study Sprint */}
            <div className="bg-teal-50/80 dark:bg-[#1f2e30] rounded-2xl p-5 border border-teal-200 dark:border-teal-500/20 flex flex-col relative overflow-hidden transition-transform hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl" />
              <div className="flex gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1 dark:text-white text-gray-900">Study Sprint</h3>
                  <p className="text-xs text-teal-900/60 dark:text-gray-400 leading-relaxed max-w-[150px]">Study for 30 minutes.</p>
                </div>
              </div>
              <div className="mt-auto">
                <div className="flex justify-between items-end mb-2">
                  <span className="font-bold text-sm text-teal-600 dark:text-teal-300">+15 XP</span>
                  <span className="text-xs text-teal-900/50 dark:text-gray-400">15/30 min</span>
                </div>
                <div className="w-full h-1.5 bg-teal-200 dark:bg-black/30 rounded-full mb-5">
                  <div className="h-full bg-teal-500 rounded-full w-[50%]" />
                </div>
                <button className="w-full py-2.5 bg-teal-100 dark:bg-teal-500/20 hover:bg-teal-200 dark:hover:bg-teal-500/30 text-teal-700 dark:text-teal-300 text-sm font-semibold rounded-xl transition-colors">
                  Start Timer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* WEEKLY LEADERBOARD */}
        <div className="lg:col-span-1 bg-white/80 dark:bg-[#1a1226]/80 backdrop-blur-md rounded-2xl p-5 border border-purple-100 dark:border-white/5 shadow-lg shadow-black/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold dark:text-white text-[#1f172a]">Weekly Leaderboard</h2>

          </div>

          <div className="flex flex-col gap-1.5">
            {[
              { rank: 1, name: "Lily K.", lvl: 7, xp: "2,450 XP", img: "https://i.pravatar.cc/150?u=1" },
              { rank: 2, name: "Umar M.", lvl: 6, xp: "2,150 XP", img: "https://i.pravatar.cc/150?u=2" },
              { rank: 3, name: "Emma R. (You)", lvl: 7, xp: "1,980 XP", img: "https://i.pravatar.cc/150?u=4", isYou: true },
            ].map((user) => (
              <div key={user.rank} className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${user.isYou ? 'bg-purple-100 dark:bg-purple-600/20 border border-purple-200 dark:border-purple-500/30' : 'hover:bg-[#522B5B]/5 dark:hover:bg-white/5 border border-transparent'}`}>
                <div className="w-6 text-center font-bold text-purple-900/40 dark:text-gray-400 flex justify-center text-sm">
                  {user.rank === 1 ? <div className="w-5 h-5 rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-500 flex items-center justify-center text-xs">1</div> :
                    user.rank === 2 ? <div className="w-5 h-5 rounded-full bg-gray-500/10 dark:bg-gray-300/20 text-gray-500 dark:text-gray-300 flex items-center justify-center text-xs">2</div> :
                      user.rank === 3 ? <div className="w-5 h-5 rounded-full bg-orange-400/20 text-orange-600 dark:text-orange-400 flex items-center justify-center text-xs">3</div> :
                        user.rank}
                </div>
                <div className="relative">
                  <img src={user.img} alt={user.name} className="w-10 h-10 rounded-full border-2 border-white dark:border-[#1a1226]" />
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold text-sm ${user.isYou ? 'text-purple-900 dark:text-white' : 'text-[#362A4A] dark:text-gray-300'}`}>{user.name}</h4>
                  <p className="text-xs text-purple-900/60 dark:text-gray-500">Level {user.lvl}</p>
                </div>
                <div className="font-medium text-sm text-[#522B5B] dark:text-gray-300">
                  {user.xp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="lg:col-span-3 flex flex-col gap-4 md:gap-6">
          {/* CHALLENGE CATEGORIES */}
          <div className="bg-white/80 dark:bg-[#1a1226]/80 backdrop-blur-md rounded-2xl p-5 border border-purple-100 dark:border-white/5 shadow-lg shadow-black/10">
            <h2 className="text-xl font-bold dark:text-white text-[#1f172a] mb-1">Challenge Categories</h2>
            <p className="text-gray-400 text-sm mb-4">Choose a category to see available challenges.</p>

            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {[
                { name: 'All', icon: List, count: 12 },
                { name: 'Math', icon: Sigma, count: 8 },
                { name: 'Logic', icon: Lightbulb, count: 8 },
                { name: 'Quizzes', icon: HelpCircle, count: 2 },
                { name: 'Study', icon: BookOpen, count: 2 },
              ].map(cat => {
                const isActive = activeCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all shrink-0 ${isActive ? 'bg-purple-100 dark:bg-purple-600/20 border-purple-300 dark:border-purple-500/50' : 'bg-[#522B5B]/5 dark:bg-white/5 border-transparent dark:border-white/5 hover:bg-[#522B5B]/10 dark:hover:bg-white/10'}`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isActive ? 'bg-purple-500 text-white' : 'bg-[#522B5B]/10 dark:bg-white/10 text-purple-900/60 dark:text-gray-300'}`}>
                      <cat.icon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className={`font-semibold text-[13px] ${isActive ? 'text-purple-900 dark:text-white' : 'text-[#362A4A] dark:text-gray-300'}`}>{cat.name}</div>
                      <div className="text-[11px] text-purple-900/60 dark:text-gray-500">{cat.count} Challenges</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ALL CHALLENGES */}
          <div className="bg-white/80 dark:bg-[#1a1226]/80 backdrop-blur-md rounded-2xl border border-purple-100 dark:border-white/5 shadow-lg shadow-black/10 overflow-hidden">
            <div className="p-5 border-b border-purple-100 dark:border-white/5 flex justify-between items-center cursor-pointer hover:bg-[#522B5B]/5 dark:hover:bg-white/[0.02] transition-colors">
              <h2 className="text-xl font-bold dark:text-white text-[#1f172a]">All Challenges</h2>
              <ChevronRight className="w-5 h-5 text-[#522B5B]/50 dark:text-gray-500" />
            </div>

            <div className="p-1.5">
              {[
                { title: "Set Theory Master", desc: "Solve 3 set theory problems with 100% accuracy.", tag1: "Hard", tagColor: "text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-400/10", tag2: "Math", prog: "1/3", pVal: 33, xp: "+30 XP", icon: Crown, iconColor: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/20" },
                { title: "Quiz Champion", desc: "Score 90% or higher on a quiz.", tag1: "Medium", tagColor: "text-orange-700 dark:text-orange-400 bg-orange-100 dark:bg-orange-400/10", tag2: "Quizzes", prog: "0/1", pVal: 0, xp: "+25 XP", icon: HelpCircle, iconColor: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/20" },
                { title: "Consistent Learner", desc: "Complete 3 study sessions this week.", tag1: "Easy", tagColor: "text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-400/10", tag2: "Study", prog: "2/3", pVal: 66, xp: "+20 XP", icon: BookOpen, iconColor: "text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-500/20" },
                { title: "Logic Explorer", desc: "Solve 5 logic puzzles.", tag1: "Medium", tagColor: "text-pink-700 dark:text-pink-400 bg-pink-100 dark:bg-pink-400/10", tag2: "Logic", prog: "3/5", pVal: 60, xp: "+15 XP", icon: Puzzle, iconColor: "text-purple-600 dark:text-purple-300 bg-purple-100 dark:bg-purple-300/20" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#522B5B]/5 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconColor}`}>
                    <item.icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-sm text-[#362A4A] dark:text-gray-200 group-hover:text-[#522B5B] dark:group-hover:text-white transition-colors">{item.title}</h3>
                    <p className="text-[12px] text-purple-900/60 dark:text-gray-500 leading-tight mt-0.5">{item.desc}</p>
                  </div>

                  <div className="flex items-center gap-1.5 hidden md:flex">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${item.tagColor}`}>{item.tag1}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider text-purple-900/60 dark:text-gray-400 bg-white/5 border border-purple-200 dark:border-white/10">{item.tag2}</span>
                  </div>

                  <div className="w-[120px] hidden md:block">
                    <div className="flex justify-between text-xs text-purple-900/60 dark:text-gray-400 mb-1.5">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">Progress</span>
                      <span className="ml-auto">{item.prog}</span>
                    </div>
                    <div className="w-full h-1.5 bg-purple-100 dark:bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${item.pVal}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-28 justify-end text-sm font-bold text-[#362A4A] dark:text-gray-300">
                    {item.xp}
                    <ChevronRight className="w-4 h-4 text-purple-900/40 dark:text-gray-600 dark:group-hover:text-gray-400 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-4 md:gap-6">
          {/* CHALLENGE CALENDAR */}
          <div className="bg-white/80 dark:bg-[#1a1226]/80 backdrop-blur-md rounded-2xl p-5 border border-purple-100 dark:border-white/5 shadow-lg shadow-black/10">
            <h2 className="text-lg font-bold dark:text-white text-[#1f172a] mb-4">Challenge Calendar</h2>
            <div className="flex justify-between items-center mb-3 text-sm font-semibold text-[#522B5B] dark:text-gray-300">
              <ChevronLeft className="w-4 h-4 cursor-pointer hover:text-purple-700 dark:hover:text-white" />
              <span>May 2024</span>
              <ChevronDown className="w-4 h-4 cursor-pointer hover:text-purple-700 dark:hover:text-white" />
            </div>

            <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className="text-xs text-purple-900/60 dark:text-gray-500 font-medium">{d}</div>
              ))}

              {/* Dummy Calendar Data */}
              <div className="text-sm py-1.5 text-black/20 dark:text-gray-600">28</div>
              <div className="text-sm py-1.5 text-black/20 dark:text-gray-600">29</div>
              <div className="text-sm py-1.5 text-black/20 dark:text-gray-600">30</div>
              {[...Array(31)].map((_, i) => {
                const day = i + 1;
                const isStreak = day >= 6 && day <= 11;
                const isToday = day === 25;
                const hasDone = day === 19;

                let renderDay = (
                  <div key={day} className={`text-sm py-1.5 relative w-8 h-8 mx-auto flex items-center justify-center rounded-full
                    ${isToday ? 'bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]' :
                      isStreak ? 'bg-purple-100 dark:bg-purple-600/30 text-purple-700 dark:text-purple-200 font-semibold' :
                        hasDone ? 'bg-purple-100 dark:bg-purple-600/30 text-purple-700 dark:text-purple-200 font-semibold' : 'text-[#362A4A] dark:text-gray-300 hover:bg-[#522B5B]/5 dark:hover:bg-white/5'}
                  `}>
                    {day}
                  </div>
                );
                return renderDay;
              })}
              <div className="text-sm py-1.5 text-black/20 dark:text-gray-600">1</div>
            </div>
          </div>

          {/* CHALLENGE REWARDS */}
          <div className="bg-white/80 dark:bg-[#1a1226]/80 backdrop-blur-md rounded-2xl p-5 border border-purple-100 dark:border-white/5 shadow-lg shadow-black/10">
            <h2 className="text-lg font-bold dark:text-white text-[#1f172a] mb-1">Challenge Rewards</h2>
            <p className="text-xs text-gray-400 mb-5 font-medium">Complete challenges to unlock amazing rewards!</p>

            <div className="flex justify-between mb-5 px-2">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400/20 to-orange-600/20 border border-orange-500/30 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-orange-400/10 blur flex items-center justify-center"></div>
                  <div className="w-6 h-6 bg-orange-400/80 rounded block shadow-sm relative z-10">
                    <div className="w-full h-2 border-b border-black/20 bg-orange-300"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-300 rounded-sm"></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-orange-400 text-sm">100 XP</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Bronze Chest</div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-300/20 to-blue-500/20 border border-blue-400/30 flex items-center justify-center relative shadow-[0_0_15px_rgba(96,165,250,0.15)]">
                  <div className="w-7 h-7 bg-blue-300/80 rounded block shadow-sm relative z-10">
                    <div className="w-full h-2.5 border-b border-black/20 bg-blue-200"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-blue-100 rounded-sm"></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-blue-300 text-sm">500 XP</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Silver Chest</div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 -mt-1 rounded-xl bg-gradient-to-br from-yellow-300/20 to-yellow-600/20 border border-yellow-400/40 flex items-center justify-center relative shadow-[0_0_20px_rgba(250,204,21,0.2)] scale-110">
                  <div className="absolute inset-0 bg-yellow-400/20 blur flex items-center justify-center"></div>
                  <div className="w-8 h-8 bg-yellow-400/90 rounded block shadow-sm relative z-10 rotate-3">
                    <div className="w-full h-3 border-b border-black/20 bg-yellow-300"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-sm shadow-[0_0_5px_white]"></div>
                  </div>
                </div>
                <div className="text-center mt-1">
                  <div className="font-bold text-yellow-400 text-sm">1,000 XP</div>
                  <div className="text-[10px] text-yellow-500/70 uppercase tracking-wider font-bold">Gold Chest</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="flex justify-end text-[10px] text-gray-400 font-bold tracking-wider mb-1">
                650 / 1,000 XP
              </div>
              <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-yellow-400 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
