import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Play, 
  Download, 
  ChevronRight, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  MessageSquare,
  ChevronLeft,
  Star,
  FileText
} from 'lucide-react';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
  pdfUrl: string;
  order: number;
}

export default function LessonPage() {
  const { id } = useParams();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLessons() {
      if (!id) return;
      setLoading(true);
      try {
        const lessonsRef = collection(db, 'lessons');
        const q = query(lessonsRef, where('courseId', '==', id), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Lesson));
        
        if (data.length === 0) {
          // Sample data for demo
          const sampleData = [
            { id: 'l1', title: 'Getting Started', content: '### Welcome to the course!\nIn this lesson, we will cover the basics and what to expect.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', pdfUrl: '#', order: 1 },
            { id: 'l2', title: 'The Fundamentals', content: '### Understanding the Core Concepts\nFundamental principles are the building blocks of mastery.', videoUrl: 'https://www.youtube.com/embed/tgbNymZ7vqY', pdfUrl: '#', order: 2 },
            { id: 'l3', title: 'Advanced Applications', content: '### Real-world scenarios\nHow to apply what you have learned in professional environments.', videoUrl: 'https://www.youtube.com/embed/tgbNymZ7vqY', pdfUrl: '#', order: 3 },
          ];
          setLessons(sampleData);
          setActiveLesson(sampleData[0]);
        } else {
          setLessons(data);
          setActiveLesson(data[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchLessons();
  }, [id]);

  if (loading) return <div className="p-20 text-center animate-pulse text-blue-600 font-bold">Loading Lesson...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar - Course Content */}
      <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl shadow-slate-200/20 dark:shadow-none">
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-black dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Course Content
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{lessons.length} Modules Total</p>
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto">
            {lessons.map((lesson, idx) => (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className={cn(
                  "w-full p-6 flex items-center gap-4 transition-all text-left border-b border-slate-50 dark:border-slate-800 last:border-0",
                  activeLesson?.id === lesson.id 
                    ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-l-blue-600" 
                    : "hover:bg-slate-50 dark:hover:bg-slate-800"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm",
                  activeLesson?.id === lesson.id 
                    ? "bg-blue-600 text-white" 
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                )}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h4 className={cn(
                    "font-bold text-sm",
                    activeLesson?.id === lesson.id ? "text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"
                  )}>
                    {lesson.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <Play className="w-3 h-3" />
                    <span>12:45 mins</span>
                  </div>
                </div>
                {activeLesson?.id === lesson.id && <div className="w-2 h-2 rounded-full bg-blue-600" />}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/10 rounded-3xl p-6 border border-amber-200 dark:border-amber-800/30 space-y-4">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold">
            <Star className="w-5 h-5 fill-current" />
            Ready for a Challenge?
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Finish this module and take the quiz to earn points and climb the leaderboard!
          </p>
          <Link 
            to={`/quiz/${activeLesson?.id}`} 
            className="block w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-center font-bold shadow-lg shadow-amber-500/20 transition-all"
          >
            Start Quiz
          </Link>
        </div>
      </div>

      {/* Main Content - Video & Content */}
      <div className="lg:col-span-8 space-y-8 order-1 lg:order-2">
        <div className="rounded-[2.5rem] overflow-hidden bg-black aspect-video shadow-2xl relative group">
          {activeLesson?.videoUrl ? (
            <iframe 
              src={activeLesson.videoUrl} 
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              title={activeLesson.title}
            ></iframe>
          ) : (
            <div className="flex items-center justify-center h-full text-white/20">
              <Play className="w-20 h-20" />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {activeLesson?.title}
              </h1>
              <div className="flex items-center gap-6 text-sm text-slate-400 font-medium tracking-wide">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> 12:45 total time
                </span>
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4" /> 2,400 downloads
                </span>
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> 45 Comments
                </span>
              </div>
            </div>
            
            <a 
              href={activeLesson?.pdfUrl} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-3 rounded-2xl font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
            >
              <FileText className="w-5 h-5" />
              Download Notes (PDF)
            </a>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 prose dark:prose-invert max-w-none shadow-sm">
            <div className="markdown-body">
              <ReactMarkdown>{activeLesson?.content || ''}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
