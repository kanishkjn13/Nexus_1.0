import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Paperclip, 
  Mic, 
  Trash2, 
  History, 
  PlusCircle,
  MessageSquare,
  Search,
  Share2,
  Bookmark,
  ChevronRight,
  BrainCircuit,
  Zap,
  Lightbulb,
  FileText
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AiView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Proofly AI, your personal academic assistant. How can I help you today? You can ask me to explain complex topics, summarize papers, or help with your assignments.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [topic, setTopic] = useState('');
  const [studyTime, setStudyTime] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  const handleNewSession = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: "New session started. How can I assist your studies now?",
        timestamp: new Date()
      }
    ]);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: `[Topic: ${topic}] [Time: ${studyTime}] ${input}`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I've analyzed your goal for "${topic}" in the next ${studyTime}. Let's dive deep into the core concepts and maximize your efficiency. What's the specific part you'd like to start with?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col lg:flex-row bg-white/40 dark:bg-[#2B124C]/30 backdrop-blur-3xl rounded-[1.5rem] md:rounded-[2.5rem] border border-white/40 dark:border-white/5 overflow-hidden h-[85vh] shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-700">
      
      {/* AI Sidebar - Hidden on mobile/tablet */}
      <div className="hidden lg:flex w-[300px] border-r border-[#522B5B]/10 dark:border-white/5 p-6 flex flex-col bg-[#522B5B]/5 dark:bg-black/20">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="p-2 bg-gradient-to-tr from-[#818CF8] to-[#C084FC] rounded-xl shadow-lg shadow-purple-500/20">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-[#362A4A] dark:text-[#FBE4D8]">Proofly AI</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400">Online</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleNewSession}
          className="flex items-center justify-center gap-2 w-full py-4 bg-[#362A4A] dark:bg-[#FBE4D8] text-white dark:text-[#190019] rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-purple-900/10 mb-6"
        >
          <PlusCircle size={20} />
          <span>New Chat</span>
        </button>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#522B5B]/40 dark:text-white/30 mb-4 px-2">Recent Chats</div>
          <div className="space-y-2">
            {[
              { id: '1', title: 'Quantum Physics Basics', date: '2h ago' },
              { id: '2', title: 'Macroeconomics Project', date: 'Yesterday' },
              { id: '3', title: 'Python Loop Logic', date: '3 days ago' },
            ].map(chat => (
              <button key={chat.id} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 group transition-all text-left">
                <div className="flex items-center gap-3">
                  <MessageSquare size={18} className="text-[#522B5B]/40 dark:text-white/40 group-hover:text-purple-500 transition-colors" />
                  <div>
                    <div className="text-sm font-bold text-[#362A4A] dark:text-[#FBE4D8] truncate w-32">{chat.title}</div>
                    <div className="text-[10px] text-[#522B5B]/40 dark:text-white/40">{chat.date}</div>
                  </div>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all text-[#362A4A] dark:text-[#FBE4D8]" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white/20 dark:bg-transparent overflow-hidden">
        
        {/* Chat Header */}
        <div className="px-4 md:px-8 py-4 md:py-6 flex items-center justify-between border-b border-[#522B5B]/10 dark:border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <History size={18} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-black text-[#362A4A] dark:text-[#FBE4D8]">Chat session</h2>
              <p className="text-[10px] md:text-xs text-[#522B5B]/50 dark:text-white/40">Academic Mode</p>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <button className="p-2 md:p-2.5 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 text-[#522B5B]/60 dark:text-white/60 transition-all">
              <Bookmark size={18} />
            </button>
            <button className="p-2 md:p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-[#522B5B]/60 dark:text-red-400 transition-all">
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-8 no-scrollbar">
          <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex gap-3 md:gap-5 animate-in fade-in slide-in-from-bottom-2 duration-400 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg ${
                  message.role === 'assistant' 
                    ? 'bg-gradient-to-tr from-[#362A4A] to-[#522B5B] text-white rotate-3' 
                    : 'bg-gradient-to-tr from-[#854F6C] to-[#DFB6B2] text-white -rotate-3'
                }`}>
                  {message.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
                </div>
                <div className={`max-w-[85%] md:max-w-[80%] flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-4 md:p-5 rounded-2xl md:rounded-3xl text-[13px] md:text-sm leading-relaxed ${
                    message.role === 'assistant'
                      ? 'bg-white/80 dark:bg-white/5 text-[#362A4A] dark:text-[#FBE4D8] border border-white dark:border-white/10 rounded-tl-none shadow-xl shadow-purple-500/5'
                      : 'bg-gradient-to-br from-[#522B5B] to-[#362A4A] text-white dark:from-[#362A4A] dark:to-[#190019] rounded-tr-none shadow-xl'
                  }`}>
                    {message.content}
                  </div>
                  <div className="mt-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[#522B5B]/30 dark:text-white/20">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 md:gap-5 animate-in fade-in slide-in-from-bottom-2 duration-400">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-gradient-to-tr from-[#362A4A] to-[#522B5B] text-white flex items-center justify-center shadow-lg rotate-3">
                  <Bot size={18} />
                </div>
                <div className="bg-white/80 dark:bg-white/5 p-4 md:p-5 rounded-2xl md:rounded-3xl border border-white dark:border-white/10 rounded-tl-none shadow-xl">
                  <div className="flex gap-1.5 items-center px-1">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="px-4 md:px-8 pb-4 md:pb-8 pt-4">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20 rounded-[1.5rem] md:rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            
            <div className="relative bg-white/80 dark:bg-[#190019]/80 backdrop-blur-2xl border border-[#522B5B]/10 dark:border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-2 md:p-3 flex flex-col gap-1 md:gap-2 shadow-2xl overflow-hidden shadow-purple-900/5">
              <div className="flex gap-2 px-2 border-b border-black/5 dark:border-white/5 pb-2">
                <div className="flex-1 flex items-center gap-2">
                  <MessageSquare size={12} className="text-[#522B5B]/30 dark:text-white/30" />
                  <input 
                    type="text"
                    placeholder="Topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-transparent border-none outline-none py-1 text-[11px] font-black text-[#362A4A] dark:text-white placeholder-[#522B5B]/30 dark:placeholder-white/20"
                  />
                </div>
                <div className="w-[1px] h-4 bg-black/5 dark:bg-white/5 self-center" />
                <div className="w-24 md:w-32 flex items-center gap-2">
                  <History size={12} className="text-[#522B5B]/30 dark:text-white/30" />
                  <input 
                    type="text"
                    placeholder="Time"
                    value={studyTime}
                    onChange={(e) => setStudyTime(e.target.value)}
                    className="w-full bg-transparent border-none outline-none py-1 text-[11px] font-black text-[#362A4A] dark:text-white placeholder-[#522B5B]/30 dark:placeholder-white/20"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && topic && studyTime && handleSendMessage()}
                  placeholder="Ask anything..."
                  className="flex-1 bg-transparent border-none outline-none py-2 md:py-3 px-2 md:px-3 text-[13px] md:text-sm text-[#362A4A] dark:text-white placeholder-[#522B5B]/30 dark:placeholder-white/30 font-bold"
                />
                
                <div className="flex items-center gap-1">
                  <button 
                    onClick={handleSendMessage}
                    disabled={!input.trim() || !topic.trim() || !studyTime.trim()}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-tr from-[#362A4A] to-[#522B5B] dark:from-[#522B5B] dark:to-[#854F6C] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50"
                  >
                    <Send size={18} fill="currentColor" className="ml-0.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
