import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  BookOpen, 
  Video, 
  MessageCircle, 
  Trophy, 
  User as UserIcon, 
  Menu, 
  X, 
  Moon, 
  Sun,
  Search,
  LogIn,
  PlusCircle,
  Layout as DashboardIcon
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { cn } from './lib/utils';

// Pages
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import LessonPage from './pages/LessonPage';
import QuizPage from './pages/QuizPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';
import ChatAssistant from './components/ChatAssistant';

const Navbar = ({ isDark, toggleTheme }: { isDark: boolean, toggleTheme: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Contact', path: '/contact', icon: MessageCircle },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <BookOpen className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-white hidden sm:block tracking-tight">
                LearnHub<span className="text-blue-600"> Ghana</span>
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  location.pathname === link.path 
                    ? "text-blue-600" 
                    : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
            
            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2" />
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:ring-2 hover:ring-blue-500/50 transition-all"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-slate-700"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                  <UserIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {profile?.displayName?.split(' ')[0] || 'Student'}
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile transitions */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-medium text-lg px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                {user ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium"
                  >
                    <DashboardIcon className="w-5 h-5" />
                    Student Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg"
                  >
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          <Navbar isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/lesson/:id" element={<LessonPage />} />
                <Route path="/quiz/:id" element={<QuizPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/backend" element={<AdminDashboard />} />
          <Route path="/portal" element={<AdminDashboard />} />
              </Routes>
            </AnimatePresence>
          </main>
          <ChatAssistant />
          
          <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
              <div>
                <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="text-white w-5 h-5" />
                  </div>
                  <span className="font-bold text-lg text-slate-900 dark:text-white">
                    LearnHub Ghana
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
                  Empowering Ghanaian students with high-quality, simple, and affordable learning resources.
                </p>
              </div>
              
              <div className="flex gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
                <Link to="/courses" className="hover:text-blue-600 transition-colors">Courses</Link>
                <Link to="/terms" className="hover:text-blue-600 transition-colors">Terms</Link>
                <a href="https://wa.me/233550477172" className="hover:text-blue-600 transition-colors">Support</a>
              </div>
              
              <p className="text-slate-400 dark:text-slate-600 text-xs">
                © {new Date().getFullYear()} LearnHub Ghana. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}
