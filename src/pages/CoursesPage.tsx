import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, BookOpen, Clock, Users, ArrowRight, Play, Filter } from 'lucide-react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
}

const categories = ["All", "Mathematics", "Science", "Mechanical Engineering", "ICT", "Bible Study"];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      try {
        const coursesRef = collection(db, 'courses');
        const q = activeCategory === 'All' 
          ? query(coursesRef) 
          : query(coursesRef, where('category', '==', activeCategory));
        
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
        
        // If no courses exist yet (first run), we could add some sample ones for the demo
        if (data.length === 0 && activeCategory === 'All') {
          // In a real app we wouldn't do this, but for the first turn it helps visualize
          setCourses([
            { id: '1', title: 'Introduction to Algebra', category: 'Mathematics', description: 'Master the basics of algebra with simple examples.', thumbnail: 'https://picsum.photos/seed/math/400/300' },
            { id: '2', title: 'Basic Physics: Energy', category: 'Science', description: 'Understanding potential and kinetic energy.', thumbnail: 'https://picsum.photos/seed/physics/400/300' },
            { id: '3', title: 'Engineering Statics', category: 'Mechanical Engineering', description: 'Forces and equilibrium in mechanical systems.', thumbnail: 'https://picsum.photos/seed/eng/400/300' },
            { id: '4', title: 'Python for Beginners', category: 'ICT', description: 'Start your coding journey with Python.', thumbnail: 'https://picsum.photos/seed/ict/400/300' },
            { id: '5', title: 'Life of Jesus Christ', category: 'Bible Study', description: 'A detailed look at the New Testament.', thumbnail: 'https://picsum.photos/seed/bible/400/300' },
          ]);
        } else {
          setCourses(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, [activeCategory]);

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <header className="space-y-6">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Explore Lessons</h1>
        <div className="flex flex-col md:flex-row gap-4 h-full">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search for topics (e.g. Algebra, Physics...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all dark:text-white"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:overflow-visible md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-6 py-4 rounded-2xl text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2",
                  activeCategory === cat 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25" 
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-500/50"
                )}
              >
                {cat === 'All' && <Filter className="w-4 h-4" />}
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 animate-pulse">
              <div className="bg-slate-200 dark:bg-slate-800 rounded-2xl aspect-video mb-4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mb-4" />
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <motion.div
              key={course.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -8 }}
              className="bg-white dark:bg-slate-900 rounded-[2rem] p-4 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none hover:border-blue-500/50 transition-all flex flex-col h-full"
            >
              <div className="relative rounded-[1.5rem] overflow-hidden aspect-video mb-6">
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1.5 text-xs text-white font-medium">
                    <Play className="w-3 h-3 fill-current" />
                    Preview
                  </div>
                </div>
              </div>

              <div className="px-2 space-y-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full">
                    {course.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                  {course.title}
                </h3>
                
                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2">
                  {course.description}
                </p>

                <div className="pt-6 mt-auto flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      12 Lessons
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      850+ Students
                    </div>
                  </div>
                  <Link 
                    to={`/lesson/${course.id}`} 
                    className="w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filteredCourses.length === 0 && !loading && (
        <div className="text-center py-20 space-y-4">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold dark:text-white">No lessons found</h3>
          <p className="text-slate-500 max-w-sm mx-auto">We couldn't find any lessons matching your search. Try a different keyword or category.</p>
        </div>
      )}

      {/* Request Section */}
      <section className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden mt-20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 blur-[100px] opacity-20 -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="space-y-4 text-center md:text-left">
             <h2 className="text-3xl font-black tracking-tight">Can't find a specific topic?</h2>
             <p className="text-slate-400 max-w-md">Our team of experts can create a lesson for you. Send us a request and we'll notify you when it's ready.</p>
           </div>
           <Link 
             to="/contact" 
             className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black hover:bg-blue-100 transition-all shadow-xl whitespace-nowrap"
           >
             Request a New Topic
           </Link>
        </div>
      </section>
    </div>
  );
}
