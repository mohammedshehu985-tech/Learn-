import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RotateCcw,
  Home,
  Check
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  id: string;
  lessonId: string;
  questions: Question[];
}

export default function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    async function fetchQuiz() {
      if (!id) return;
      try {
        const q = query(collection(db, 'quizzes'), where('lessonId', '==', id));
        const snap = await getDocs(q);
        if (snap.docs.length > 0) {
          setQuiz({ id: snap.docs[0].id, ...snap.docs[0].data() } as Quiz);
        } else {
          // Sample quiz for demo
          setQuiz({
            id: 'q1',
            lessonId: id,
            questions: [
              { question: "What is the capital of Ghana?", options: ["Kumasi", "Accra", "Tamale", "Tema"], correctAnswer: 1 },
              { question: "Which layer of the atmosphere contains the ozone layer?", options: ["Troposphere", "Stratosphere", "Mesosphere", "Exosphere"], correctAnswer: 1 },
              { question: "In Mathematics, what is the square root of 144?", options: ["10", "11", "12", "14"], correctAnswer: 2 },
            ]
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [id]);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    
    if (idx === quiz?.questions[currentIdx].correctAnswer) {
      setScore(s => s + 1);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < (quiz?.questions.length || 0)) {
      setCurrentIdx(currentIdx + 1);
      setSelected(null);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setShowResult(true);
    if (user) {
      try {
        // Save result
        await addDoc(collection(db, 'quiz_results'), {
          userId: user.uid,
          userName: profile?.displayName || 'Student',
          quizId: quiz?.id,
          score: score,
          total: quiz?.questions.length,
          timestamp: new Date()
        });
        
        // Update user points: 10 points per correct answer
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          points: increment(score * 10)
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="p-20 text-center text-blue-600 font-bold">Initializing Quiz...</div>;
  if (!quiz) return <div className="p-20 text-center">No quiz found for this lesson.</div>;

  const currentQuestion = quiz.questions[currentIdx];

  return (
    <div className="max-w-3xl mx-auto py-10 h-full flex flex-col">
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-widest text-blue-600">Question {currentIdx + 1} of {quiz.questions.length}</span>
                <div className="w-48 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIdx + 1) / quiz.questions.length) * 100}%` }}
                    className="h-full bg-blue-600"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-600 dark:text-amber-400 font-bold">
                <Trophy className="w-4 h-4" />
                <span>{score * 10} pts</span>
              </div>
            </div>

            {/* Question Card */}
            <motion.div 
              animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
              className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none"
            >
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight mb-10">
                {currentQuestion.question}
              </h2>

              <div className="space-y-4">
                {currentQuestion.options.map((opt, i) => {
                  const isCorrect = i === currentQuestion.correctAnswer;
                  const isSelected = i === selected;
                  
                  return (
                    <button
                      key={i}
                      disabled={selected !== null}
                      onClick={() => handleSelect(i)}
                      className={cn(
                        "w-full p-6 rounded-2xl border-2 text-left font-bold transition-all flex items-center justify-between group",
                        selected === null 
                          ? "border-slate-100 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 md:hover:translate-x-2" 
                          : isCorrect 
                            ? "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : isSelected 
                              ? "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                              : "border-slate-100 dark:border-slate-800 opacity-50"
                      )}
                    >
                      <span className="flex items-center gap-4">
                        <span className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center text-xs",
                          selected === null ? "bg-slate-100 dark:bg-slate-800 text-slate-500" : isCorrect ? "bg-green-500 text-white" : isSelected ? "bg-red-500 text-white" : "bg-slate-100 dark:bg-slate-800"
                        )}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </span>
                      {selected !== null && isCorrect && <CheckCircle className="w-6 h-6 text-green-500" />}
                      {selected !== null && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            {/* Next Button */}
            <div className="flex justify-end">
              <button
                disabled={selected === null}
                onClick={handleNext}
                className={cn(
                  "px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg",
                  selected === null 
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed" 
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/25 active:scale-95"
                )}
              >
                {currentIdx + 1 === quiz.questions.length ? "Finish Quiz" : "Next Question"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-10 py-10"
          >
            <div className="relative inline-block">
               <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 transform scale-150" />
               <div className="relative w-40 h-40 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl">
                 <Trophy className="text-white w-20 h-20" />
               </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl font-black dark:text-white">Awesome Job!</h1>
              <p className="text-xl text-slate-500 dark:text-slate-400">You've completed the quiz and earned some points.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 inline-flex gap-16 items-center shadow-xl shadow-slate-200/20 dark:shadow-none">
               <div className="text-center space-y-1">
                 <div className="text-sm font-black uppercase tracking-widest text-slate-400">Score</div>
                 <div className="text-4xl font-black text-blue-600">{score}/{quiz.questions.length}</div>
               </div>
               <div className="w-[1px] h-12 bg-slate-200 dark:bg-slate-800" />
               <div className="text-center space-y-1">
                 <div className="text-sm font-black uppercase tracking-widest text-slate-400">Points</div>
                 <div className="text-4xl font-black text-amber-500">+{score * 10}</div>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
               <button 
                 onClick={() => navigate('/courses')}
                 className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/25 w-full sm:w-auto"
               >
                 <ArrowRight className="w-5 h-5" />
                 Next Lesson
               </button>
               <button 
                 onClick={() => window.location.reload()}
                 className="flex items-center gap-2 px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all w-full sm:w-auto"
               >
                 <RotateCcw className="w-5 h-5" />
                 Retry Quiz
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
