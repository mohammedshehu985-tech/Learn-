import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { getChatAssistantResponse } from '../services/geminiService';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', parts: [{ text: input }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const response = await getChatAssistantResponse(input, messages);
    setMessages(prev => [...prev, { role: 'model', parts: [{ text: response || '' }] }]);
    setLoading(false);
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 border border-white/20"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-8 z-50 w-[90vw] sm:w-[400px] h-[600px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">LearnHub Assistant</h3>
                  <div className="flex items-center gap-1.5 py-0.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-blue-100 uppercase font-black tracking-widest leading-none">Online & Ready</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth bg-slate-50 dark:bg-slate-950/50"
            >
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center">
                    <Bot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold dark:text-white">Hello! I'm your AI tutor.</h4>
                    <p className="text-sm text-slate-500">Ask me anything about Math, Science, ICT, or any other subject!</p>
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex gap-3",
                    m.role === 'user' ? "flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1",
                    m.role === 'user' ? "bg-slate-200 dark:bg-slate-800" : "bg-blue-600 shadow-md"
                  )}>
                    {m.role === 'user' ? <User className="w-4 h-4 text-slate-600 dark:text-slate-400" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  <div className={cn(
                    "max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed",
                    m.role === 'user' 
                      ? "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm rounded-tr-none border border-slate-100 dark:border-slate-800" 
                      : "bg-blue-600 text-white rounded-tl-none shadow-lg shadow-blue-500/10"
                  )}>
                    {m.parts[0].text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 animate-bounce">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                    <span className="text-xs text-slate-500 font-medium">Assistant thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
              <div className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your question here..."
                  className="w-full pl-4 pr-12 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all text-sm dark:text-white"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
