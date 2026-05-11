import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  User, 
  AlertCircle,
  BookOpen,
  Chrome,
  CreditCard,
  CheckCircle2,
  Smartphone,
  Hash,
  Copy,
  Check
} from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const MOMO_NUMBER = "0201563234"; // Merchant number
const MOMO_NAME = "LearnHub Ghana (Pay)";

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;
      
      await updateProfile(user, { displayName: name });
      
      // User profile in firestore - AUTO APPROVED
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: name,
        email: email,
        role: 'student',
        points: 0,
        hasPaid: true, 
        paymentStatus: 'approved',
        paymentReference: 'FREE-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
        registrationFee: 0,
        createdAt: new Date()
      });
      
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Account creation failed. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[80vh] bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
      <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center max-w-xl mx-auto space-y-8">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-lg dark:text-white">LearnHub Ghana</span>
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Create Account</h1>
            <div className="px-4 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-black rounded-full uppercase tracking-widest">
              Open Access
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Join the fastest growing learning community in Ghana. All courses are now open!</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all dark:text-white"
                placeholder="Kodjo Mensah"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all dark:text-white"
                placeholder="you@email.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all dark:text-white"
                placeholder="At least 6 characters"
                minLength={6}
              />
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up Now'} <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Sign In</Link>
        </p>
      </div>

      <div className="hidden lg:block flex-1 bg-blue-600 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2670&auto=format&fit=crop" 
          alt="Signup Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-blue-600/40" />
        <div className="relative h-full flex flex-col items-center justify-center text-white p-20 space-y-8 text-center">
           <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl text-white">
              <BookOpen className="w-10 h-10" />
           </div>
           <div className="space-y-4">
             <h2 className="text-4xl font-black">Unlimited Learning Access</h2>
             <p className="text-blue-100 text-lg opacity-80">
               Join thousands of Ghanaian students who are already mastering new skills on LearnHub.
             </p>
           </div>
           
           <div className="grid grid-cols-2 gap-4 w-full max-w-sm pt-10">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                 <div className="text-2xl font-black italic">Free</div>
                 <div className="text-xs uppercase tracking-widest font-bold opacity-60">Access</div>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                 <div className="text-2xl font-black italic">24/7</div>
                 <div className="text-xs uppercase tracking-widest font-bold opacity-60">Available</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

