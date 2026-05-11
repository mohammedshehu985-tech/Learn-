import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  BookOpen, 
  Zap, 
  Users, 
  MessageCircle,
  Play,
  Download,
  CheckCircle,
  Lightbulb,
  Search,
  Trophy,
  Video
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';

const categories = [
  { name: 'Mathematics', icon: 'Σ', color: 'bg-blue-500', desc: 'Algebra, Geometry, Calculus' },
  { name: 'Science', icon: '⚛', color: 'bg-green-500', desc: 'Physics, Chemistry, Biology' },
  { name: 'Mechanical Engineering', icon: '⚙', color: 'bg-orange-500', desc: 'Statics, Dynamics, CAD' },
  { name: 'ICT', icon: '💻', color: 'bg-purple-500', desc: 'Coding, Networking, Hardware' },
  { name: 'Bible Study', icon: '📖', color: 'bg-amber-500', desc: 'Old & New Testament Study' },
];

const quotes = [
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
];

export default function HomePage() {
  const [quote, setQuote] = useState(quotes[0]);

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-20 pb-20"
    >
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-blue-600 dark:bg-blue-900 border border-blue-500/20 shadow-2xl shadow-blue-500/20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/ghana-edu/1920/1080?blur=2" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-600/80 to-transparent" />
        </div>
        
        <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-blue-50 text-sm font-medium border border-white/20">
              <Zap className="w-4 h-4 text-amber-400" />
              Empowering Ghana's Next Generation
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight"
            >
              Master Any Subject with <br />
              <span className="text-blue-200">LearnHub Ghana</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-blue-100/80 text-lg md:text-xl max-w-xl leading-relaxed"
            >
              Simple explanations, interactive quizzes, and expert-led tutorials. 
              Join thousands of students and start your journey today.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <Link 
                to="/courses" 
                className="bg-white text-blue-600 px-8 py-4 rounded-2xl text-lg font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center gap-2"
              >
                Browse Lessons
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/signup" 
                className="bg-blue-700/50 backdrop-blur-md text-white border border-blue-400/30 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-blue-700/70 transition-all"
              >
                Join for Free
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            variants={itemVariants}
            className="hidden lg:block flex-1 relative"
          >
            <div className="relative z-10 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-2xl border border-white/10">
              <img 
                src="https://picsum.photos/seed/student/800/600" 
                alt="Student learning" 
                className="rounded-2xl shadow-inner w-full"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -right-6 bg-amber-400 p-6 rounded-2xl shadow-xl rotate-3">
                <Trophy className="text-white w-8 h-8" />
              </div>
              <div className="absolute -top-6 -left-6 bg-white dark:bg-slate-700 p-4 rounded-2xl shadow-xl -rotate-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Play className="text-blue-600 dark:text-blue-400 w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Total Lessons</div>
                  <div className="font-bold dark:text-white">500+ Videos</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Explore Categories</h2>
            <p className="text-slate-500 dark:text-slate-400">Pick a subject and start learning for free today.</p>
          </div>
          <Link to="/courses" className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
            See all categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <motion.div
              key={cat.name}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all group"
            >
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-6 group-hover:scale-110 transition-transform", cat.color, "text-white")}>
                {cat.icon}
              </div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">{cat.name}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{cat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quote & Question of the Day Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div variants={itemVariants} className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden flex flex-col justify-center">
          <MessageCircle className="absolute -top-4 -right-4 w-32 h-32 text-white/5" />
          <div className="relative z-10 space-y-6">
            <span className="text-blue-400 font-bold uppercase tracking-widest text-xs">Motivational Quote</span>
            <p className="text-2xl font-medium leading-relaxed">
              "{quote.text}"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-[2px] bg-blue-500" />
              <span className="text-slate-400 italic">{quote.author}</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-200 dark:border-slate-800 space-y-6 flex flex-col">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
              <Lightbulb className="text-amber-500 w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black dark:text-white">Question of the Day</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-lg italic">
            "Who was the first President of Ghana and what was his primary goal for the country?"
          </p>
          <div className="mt-auto space-y-4">
            <button className="w-full py-3 rounded-2xl border-2 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
              Submit Answer
            </button>
            <p className="text-xs text-center text-slate-400">Earn +10 points for a correct answer!</p>
          </div>
        </motion.div>
      </section>

      {/* Features List */}
      <section className="py-10">
        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-[3rem] p-8 md:p-20 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Video, title: "Video Tutorials", desc: "Watch high-quality video lessons explained in simple English." },
            { icon: Download, title: "Study Materials", desc: "Download PDF notes and handouts for all subjects." },
            { icon: CheckCircle, title: "Practice Quizzes", desc: "Test your knowledge with quizzes and climb the leaderboard." },
          ].map((feature, i) => (
            <motion.div key={i} variants={itemVariants} className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/5">
                <feature.icon className="text-blue-600 w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold dark:text-white">{feature.title}</h4>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
