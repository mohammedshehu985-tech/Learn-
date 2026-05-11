import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { 
  Trophy, 
  BookOpen, 
  Star, 
  Settings, 
  LogOut, 
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { auth } from '../lib/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function DashboardPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="p-20 text-center animate-pulse text-blue-600 font-bold">Loading Your Progress...</div>;
  if (!user) return null;

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  const progress = [
    { title: 'Algebra Fundamentals', type: 'Course', percent: 85, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'Physics: Energy', type: 'Quiz', percent: 100, icon: Star, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    { title: 'ICT: Coding Basics', type: 'Course', percent: 40, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-blue-500/20">
            {profile?.displayName?.[0] || 'S'}
          </div>
          <div>
            <h1 className="text-3xl font-black dark:text-white leading-tight">Welcome back, {profile?.displayName || 'Student'}!</h1>
            <p className="text-slate-500 dark:text-slate-400">Keep up the great work. You're doing amazing.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          {profile?.role === 'admin' && (
             <Link 
               to="/admin" 
               className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20"
             >
               <ShieldCheck className="w-5 h-5" />
               Admin Panel
             </Link>
          )}
          <button 
            onClick={handleLogout}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Points', value: profile?.points || 0, icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/10' },
          { label: 'Courses Started', value: 8, icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
          { label: 'Quizzes Passed', value: 12, icon: Star, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/10' },
          { label: 'Global Rank', value: '#154', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <stat.icon className={cn("absolute -top-4 -right-4 w-24 h-24 opacity-5 transition-transform group-hover:scale-110", stat.color)} />
            <div className="relative z-10 space-y-4">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div>
                <div className="text-sm font-black uppercase tracking-widest text-slate-400">{stat.label}</div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="text-2xl font-black dark:text-white">Recent Progress</h3>
              <Link to="/courses" className="text-blue-600 font-bold text-sm hover:underline">View All</Link>
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
               {progress.map((item, i) => (
                 <div key={i} className="p-8 flex flex-col md:flex-row items-center gap-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0", item.bg)}>
                      <item.icon className={cn("w-7 h-7", item.color)} />
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                       <div className="flex justify-between items-center">
                          <h4 className="font-bold dark:text-white">{item.title}</h4>
                          <span className="text-xs font-black uppercase tracking-widest text-slate-400">{item.type}</span>
                       </div>
                       <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percent}%` }}
                            transition={{ duration: 1, delay: i * 0.2 }}
                            className={cn("h-full", item.color.replace('text-', 'bg-'))}
                          />
                       </div>
                       <div className="flex justify-between items-center text-xs text-slate-400 font-bold">
                          <span>{item.percent}% Complete</span>
                          <span>{item.percent === 100 ? 'Completed' : '12:45 total mins'}</span>
                       </div>
                    </div>
                    <Link 
                      to="/courses" 
                      className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Community Leaderboard Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
              <Trophy className="absolute -top-10 -right-10 w-48 h-48 text-white/5 rotate-12" />
              <div className="relative z-10 space-y-8">
                 <div className="space-y-1">
                   <h3 className="text-2xl font-black">Top Students</h3>
                   <p className="text-slate-400 text-sm">Learning leaderboard in Ghana</p>
                 </div>

                 <div className="space-y-4">
                    {[
                      { name: 'Kodjo Mensah', points: 4500, rank: 1, avatar: 'KM' },
                      { name: 'Ama Serwaa', points: 4200, rank: 2, avatar: 'AS' },
                      { name: 'Kweku Addo', points: 3950, rank: 3, avatar: 'KA' },
                      { name: 'Efua B.', points: 3800, rank: 4, avatar: 'EB' },
                      { name: 'Yaw Preko', points: 3500, rank: 5, avatar: 'YP' },
                    ].map((entry, i) => (
                      <div key={i} className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl transition-all",
                        entry.name === profile?.displayName ? "bg-blue-600" : "bg-white/5 border border-white/5 hover:bg-white/10"
                      )}>
                         <div className="text-xl font-black w-6 text-slate-500">{entry.rank}</div>
                         <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                            {entry.avatar}
                         </div>
                         <div className="flex-1">
                            <div className="font-bold text-sm">{entry.name}</div>
                            <div className="text-xs text-slate-400">{entry.points} pts</div>
                         </div>
                         {entry.rank <= 3 && (
                           <Star className={cn(
                             "w-4 h-4 fill-current",
                             entry.rank === 1 ? "text-amber-400" : entry.rank === 2 ? "text-slate-300" : "text-amber-700"
                           )} />
                         )}
                      </div>
                    ))}
                 </div>

                 <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm tracking-tight hover:bg-blue-100 transition-all">
                    View Full Leaderboard
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
