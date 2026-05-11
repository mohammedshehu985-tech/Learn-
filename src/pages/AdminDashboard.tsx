import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowLeft, 
  Save, 
  Upload, 
  Video, 
  FileText, 
  Layout, 
  Settings,
  AlertCircle,
  Database,
  CreditCard,
  DollarSign,
  TrendingUp,
  Search,
  CheckCircle2
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface PaidUser {
  id: string;
  displayName: string;
  email: string;
  paymentReference: string;
  transactionId?: string;
  paymentStatus?: 'pending' | 'approved' | 'rejected';
  hasPaid: boolean;
  registrationFee: number;
  createdAt: any;
}

export default function AdminDashboard() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'courses' | 'lessons' | 'quizzes' | 'payments' | 'system'>('courses');
  const [serverStatus, setServerStatus] = useState<any>(null);
  const [status, setStatus] = useState({ msg: '', type: '' });
  const [paidUsers, setPaidUsers] = useState<PaidUser[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isFetchingPayments, setIsFetchingPayments] = useState(false);

  useEffect(() => {
    if (activeTab === 'payments') {
      fetchPayments();
    }
    if (activeTab === 'system') {
      fetchServerStatus();
    }
  }, [activeTab]);

  const fetchServerStatus = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setServerStatus(data);
    } catch (err) {
      setServerStatus({ status: 'offline', message: 'Backend connection failed' });
    }
  };

  const fetchPayments = async () => {
    setIsFetchingPayments(true);
    try {
      // Fetch users who have a payment status (pending or approved)
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const allUsers = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaidUser));
      const relevantUsers = allUsers.filter(u => u.paymentStatus === 'pending' || u.hasPaid === true);
      
      setPaidUsers(relevantUsers);
      setTotalRevenue(relevantUsers.filter(u => u.hasPaid).reduce((acc, curr) => acc + (curr.registrationFee || 0), 0));
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingPayments(false);
    }
  };

  const approvePayment = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        hasPaid: true,
        paymentStatus: 'approved'
      });
      setStatus({ msg: 'Payment approved successfully!', type: 'success' });
      fetchPayments();
    } catch (err: any) {
      setStatus({ msg: err.message, type: 'error' });
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse text-blue-600 font-bold">Verifying Permissions...</div>;
  if (!user || profile?.role !== 'admin') {
    return (
      <div className="p-20 text-center space-y-6">
        <AlertCircle className="w-20 h-20 text-red-500 mx-auto" />
        <h1 className="text-3xl font-black">Access Denied</h1>
        <p className="text-slate-500">You must be an administrator to access this page.</p>
        <button onClick={() => navigate('/')} className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold">Go Home</button>
      </div>
    );
  }

  const PaymentsView = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl text-green-600">
                <DollarSign className="w-6 h-6" />
              </div>
           </div>
           <div className="text-sm font-black uppercase tracking-widest text-slate-400">Total Revenue</div>
           <div className="text-3xl font-black dark:text-white">GHS {totalRevenue.toFixed(2)}</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600">
                <CreditCard className="w-6 h-6" />
              </div>
           </div>
           <div className="text-sm font-black uppercase tracking-widest text-slate-400">Successful</div>
           <div className="text-3xl font-black dark:text-white">{paidUsers.filter(u => u.hasPaid).length} Users</div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl text-amber-600">
                <AlertCircle className="w-6 h-6" />
              </div>
           </div>
           <div className="text-sm font-black uppercase tracking-widest text-slate-400">Pending Approval</div>
           <div className="text-3xl font-black dark:text-white">{paidUsers.filter(u => u.paymentStatus === 'pending').length}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
         <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
            <h3 className="font-black dark:text-white">Payment Verifications</h3>
            <button onClick={fetchPayments} className="text-xs font-black text-blue-600 hover:underline">Refresh List</button>
         </div>
         
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-black tracking-widest text-slate-400">
                     <th className="px-6 py-4">Student</th>
                     <th className="px-6 py-4">Ref / Trans ID</th>
                     <th className="px-6 py-4">Amount</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paidUsers.map(u => (
                    <tr key={u.id} className="text-sm dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all">
                       <td className="px-6 py-4 font-bold">
                          {u.displayName}
                          <div className="text-[10px] font-normal text-slate-400">{u.email}</div>
                       </td>
                       <td className="px-6 py-4 font-mono text-xs">
                          <div className="text-blue-600 font-bold">{u.paymentReference}</div>
                          <div className="text-slate-400">ID: {u.transactionId || 'N/A'}</div>
                       </td>
                       <td className="px-6 py-4 font-black">GHS {u.registrationFee}</td>
                       <td className="px-6 py-4">
                          {u.hasPaid ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded text-[9px] font-black uppercase tracking-tighter">
                               <CheckCircle2 className="w-3 h-3" /> Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded text-[9px] font-black uppercase tracking-tighter">
                               <AlertCircle className="w-3 h-3" /> Pending
                            </span>
                          )}
                       </td>
                       <td className="px-6 py-4">
                          {!u.hasPaid && (
                            <button 
                              onClick={() => approvePayment(u.id)}
                              className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-black hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
                            >
                              Approve
                            </button>
                          )}
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
            {paidUsers.length === 0 && !isFetchingPayments && (
              <div className="p-12 text-center text-slate-400 italic font-medium">No transactions found.</div>
            )}
         </div>
      </div>
    </div>
  );
  const AddCourseForm = () => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Mathematics');
    const [desc, setDesc] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await addDoc(collection(db, 'courses'), {
          title, category, description: desc, thumbnail: `https://picsum.photos/seed/${title}/400/300`, createdAt: new Date()
        });
        setStatus({ msg: 'Course added successfully!', type: 'success' });
        setTitle(''); setDesc('');
      } catch (err: any) {
        setStatus({ msg: err.message, type: 'error' });
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-2xl font-black dark:text-white flex items-center gap-2">
          <Plus className="w-6 h-6 text-blue-600" />
          Create New Course
        </h3>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400">Course Title</label>
          <input 
            type="text" value={title} onChange={e => setTitle(e.target.value)} required
            className="w-full px-6 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 outline-none dark:text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400">Category</label>
          <select 
            value={category} onChange={e => setCategory(e.target.value)}
            className="w-full px-6 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 outline-none dark:text-white appearance-none"
          >
            {["Mathematics", "Science", "Mechanical Engineering", "ICT", "Bible Study"].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400">Description</label>
          <textarea 
            rows={4} value={desc} onChange={e => setDesc(e.target.value)} required
            className="w-full px-6 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 outline-none dark:text-white"
          />
        </div>
        <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg">Save Course</button>
      </form>
    );
  };

  const LessonManagement = () => {
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [pdfUrl, setPdfUrl] = useState('');
    const [order, setOrder] = useState(1);

    useEffect(() => {
      async function fetchCourses() {
        const snap = await getDocs(collection(db, 'courses'));
        setCourses(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
      fetchCourses();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedCourse) {
        setStatus({ msg: 'Please select a course first', type: 'error' });
        return;
      }
      try {
        await addDoc(collection(db, 'lessons'), {
          courseId: selectedCourse,
          title,
          content,
          videoUrl,
          pdfUrl,
          order: Number(order),
          createdAt: new Date()
        });
        setStatus({ msg: 'Lesson added successfully!', type: 'success' });
        setTitle(''); setContent(''); setVideoUrl(''); setPdfUrl('');
      } catch (err: any) {
        setStatus({ msg: err.message, type: 'error' });
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-2xl font-black dark:text-white flex items-center gap-2">
          <Video className="w-6 h-6 text-blue-600" />
          Add New Lesson
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Select Course</label>
            <select 
              value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} required
              className="w-full px-6 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 outline-none dark:text-white appearance-none"
            >
              <option value="">Choose a Course...</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Lesson Title</label>
            <input 
              type="text" value={title} onChange={e => setTitle(e.target.value)} required
              className="w-full px-6 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 outline-none dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Video URL (YouTube Embed)</label>
            <input 
              type="url" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..."
              className="w-full px-6 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 outline-none dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">PDF Study Notes URL</label>
            <input 
              type="url" value={pdfUrl} onChange={e => setPdfUrl(e.target.value)} placeholder="Link to PDF file..."
              className="w-full px-6 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 outline-none dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400">Markdown Content</label>
          <textarea 
            rows={6} value={content} onChange={e => setContent(e.target.value)} required
            placeholder="Write your lesson explanation here using Markdown..."
            className="w-full px-6 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 outline-none dark:text-white font-mono text-sm"
          />
        </div>

        <div className="flex items-center gap-4">
           <div className="space-y-2 w-32">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Order</label>
              <input 
                type="number" value={order} onChange={e => setOrder(Number(e.target.value))} 
                className="w-full px-6 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 outline-none dark:text-white"
              />
           </div>
           <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
             Publish Lesson
           </button>
        </div>
      </form>
    );
  };

  const SystemManagement = () => {
    const [seeding, setSeeding] = useState(false);

    const seedContent = async () => {
      setSeeding(true);
      try {
        const sampleCourses = [
          { title: 'Algebra & Calculus', category: 'Mathematics', description: 'Advanced mathematical concepts for engineering.', thumbnail: 'https://picsum.photos/seed/math92/400/300' },
          { title: 'Modern Physics', category: 'Science', description: 'Quantum mechanics and relativity explained simply.', thumbnail: 'https://picsum.photos/seed/science12/400/300' },
          { title: 'Fluid Dynamics', category: 'Mechanical Engineering', description: 'Study of fluids and their behavior under force.', thumbnail: 'https://picsum.photos/seed/mech34/400/300' },
          { title: 'Fullstack Web Dev', category: 'ICT', description: 'Build enterprise-grade web applications.', thumbnail: 'https://picsum.photos/seed/ict56/400/300' },
          { title: 'Biblical Archaeology', category: 'Bible Study', description: 'Exploring the history through artifacts.', thumbnail: 'https://picsum.photos/seed/bible78/400/300' },
        ];

        for (const c of sampleCourses) {
          const docRef = await addDoc(collection(db, 'courses'), { ...c, createdAt: new Date() });
          await addDoc(collection(db, 'lessons'), {
            courseId: docRef.id,
            title: `Introduction to ${c.category}`,
            content: `### Welcome to ${c.title}\n\nThis is a sample module for ${c.category}. In this lesson we will explore the core concepts defined in the curriculum.\n\n#### Key Learning Outcomes:\n1. Understand basic terminology\n2. Real-world application of ${c.category}\n3. Exam preparation strategies\n\nPlease download the PDF below for detailed study notes.`,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', // Example public PDF
            order: 1,
            createdAt: new Date()
          });
        }
        setStatus({ msg: 'Sample content seeded successfully!', type: 'success' });
      } catch (err: any) {
        setStatus({ msg: err.message, type: 'error' });
      } finally {
        setSeeding(false);
      }
    };

    return (
      <div className="space-y-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <h3 className="text-2xl font-black dark:text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            Backend System Health
          </h3>
          
          {serverStatus ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn(
                    "w-3 h-3 rounded-full animate-pulse",
                    serverStatus.status === 'online' ? "bg-green-500" : "bg-red-500"
                  )} />
                  <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">Server Status</span>
                </div>
                <div className="text-2xl font-black dark:text-white italic capitalize">{serverStatus.status}</div>
                <p className="text-sm text-slate-500 mt-1">{serverStatus.message}</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                 <div className="flex items-center gap-3 mb-2">
                   <Database className="w-4 h-4 text-slate-400" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Supabase Engine</span>
                 </div>
                 <div className={cn(
                   "text-xl font-black italic",
                   serverStatus.supabaseConnected ? "text-green-600" : "text-amber-600"
                 )}>
                   {serverStatus.supabaseConnected ? 'Connected' : 'Missing Config'}
                 </div>
                 <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Linking Supabase Cloud</p>
              </div>
              
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Last Heartbeat</span>
                <div className="text-xl font-mono text-slate-600 dark:text-slate-300">
                  {serverStatus.timestamp ? new Date(serverStatus.timestamp).toLocaleTimeString() : 'N/A'}
                </div>
                <button onClick={fetchServerStatus} className="mt-3 text-xs font-bold text-blue-600 hover:underline">Refresh Session</button>
              </div>
            </div>
          ) : (
            <div className="p-10 text-center animate-pulse text-slate-400">Connecting to LearnHub Engine...</div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <h3 className="text-2xl font-black dark:text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-600" />
            System Tools
          </h3>
          <p className="text-slate-500 text-sm">Use these tools to manage the platform's core data. Be careful as some actions are irreversible.</p>
          
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
             <div>
                <h4 className="font-bold dark:text-white">Seed Sample Content</h4>
                <p className="text-xs text-slate-400">Populate courses and lessons with sample PDFs for testing.</p>
             </div>
             <button 
               onClick={seedContent} disabled={seeding}
               className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm disabled:opacity-50"
             >
               {seeding ? 'Seeding...' : 'Run Seed'}
             </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 pb-20">
      <header className="flex justify-between items-center bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <Database className="absolute -bottom-10 -right-10 w-48 h-48 text-white/5 -rotate-12" />
        <div className="relative z-10 space-y-4">
           <h1 className="text-4xl font-black tracking-tight">Admin Terminal</h1>
           <p className="text-slate-400">Manage LearnHub Ghana's educational platform content.</p>
           <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm text-blue-400 font-bold hover:text-blue-300">
             <ArrowLeft className="w-4 h-4" /> Back to Dashboard
           </button>
        </div>
      </header>

      {status.msg && (
        <div className={cn(
          "p-4 rounded-2xl border flex items-center gap-3 font-bold",
          status.type === 'success' ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"
        )}>
          {status.type === 'success' ? <Database className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {status.msg}
          <button onClick={() => setStatus({ msg: '', type: '' })} className="ml-auto">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 space-y-3">
          {[
            { id: 'courses', label: 'Management', icon: Layout },
            { id: 'lessons', label: 'Video Lessons', icon: Video },
            { id: 'payments', label: 'Payments', icon: CreditCard },
            { id: 'system', label: 'System', icon: Settings },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "w-full px-6 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all",
                activeTab === tab.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:border-blue-500/50"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-9">
           <AnimatePresence mode="wait">
              {activeTab === 'courses' && (
                <motion.div key="courses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <AddCourseForm />
                </motion.div>
              )}
              {activeTab === 'payments' && (
                <motion.div key="payments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <PaymentsView />
                </motion.div>
              )}
              {activeTab === 'lessons' && (
                <motion.div key="lessons" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <LessonManagement />
                </motion.div>
              )}
              {activeTab === 'system' && (
                <motion.div key="system" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <SystemManagement />
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
