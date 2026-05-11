import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MessageCircle, 
  Mail, 
  MapPin, 
  Phone, 
  Send, 
  Clock,
  ArrowRight,
  ExternalLink,
  Twitter,
  Facebook,
  Instagram
} from 'lucide-react';
import { cn } from '../lib/utils';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="space-y-16 pb-20">
      <header className="text-center space-y-6 max-w-2xl mx-auto py-10">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full text-blue-600 dark:text-blue-400 text-sm font-black uppercase tracking-widest"
        >
          <MessageCircle className="w-4 h-4" />
          Get In Touch
        </motion.div>
        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          How can we help you <span className="text-blue-600">succeed?</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          We're here to help all Ghanaian students. Reach out to us for support, partnerships, or topic requests.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-8">
           <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <MessageCircle className="absolute -bottom-10 -left-10 w-48 h-48 text-white/5 -rotate-12" />
              <div className="relative z-10 space-y-10">
                 <div className="space-y-4">
                   <h2 className="text-3xl font-black">Direct Contact</h2>
                   <p className="text-blue-100/80">Support is available Monday to Friday, 8am to 5pm GMT.</p>
                 </div>

                 <div className="space-y-6">
                    {[
                      { icon: Mail, label: 'Email Us', value: 'hello@learnhubghana.com' },
                      { icon: Phone, label: 'Call Support', value: '+233 55 047 7172' },
                      { icon: MapPin, label: 'Visit Office', value: 'East Legon, Accra, Ghana' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 group cursor-pointer">
                         <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center transition-all group-hover:bg-white/20">
                            <item.icon className="w-6 h-6 text-white" />
                         </div>
                         <div>
                            <div className="text-xs font-black uppercase tracking-widest text-blue-200">{item.label}</div>
                            <div className="font-bold text-lg">{item.value}</div>
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="pt-6 border-t border-white/20 space-y-4">
                    <p className="font-bold text-sm">Follow our journey:</p>
                    <div className="flex gap-4">
                       {[Twitter, Facebook, Instagram].map((Icon, i) => (
                         <div key={i} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all cursor-pointer">
                            <Icon className="w-5 h-5" />
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           <a 
             href="https://wa.me/233550477172" 
             target="_blank" 
             rel="noreferrer"
             className="flex items-center justify-between p-8 bg-green-500 rounded-[2rem] text-white shadow-xl shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all group"
           >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                   <MessageCircle className="w-7 h-7" />
                </div>
                <div>
                   <h3 className="font-black text-xl">Chat on WhatsApp</h3>
                   <p className="text-green-50 text-sm opacity-80">Instant support for students</p>
                </div>
              </div>
              <ExternalLink className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
           </a>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none h-full">
          {submitted ? (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20"
             >
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                   <Send className="text-green-600 dark:text-green-400 w-10 h-10" />
                </div>
                <div className="space-y-2">
                   <h2 className="text-3xl font-black dark:text-white">Message Sent!</h2>
                   <p className="text-slate-500 max-w-sm mx-auto">Thank you for reaching out. A LearnHub representative will contact you within 24 hours.</p>
                </div>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                >
                  Send another message
                </button>
             </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Kodjo Mensah"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all dark:text-white font-medium"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="you@email.com"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all dark:text-white font-medium"
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                 <select className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all dark:text-white font-medium appearance-none">
                    <option>General Inquiry</option>
                    <option>Topic Request</option>
                    <option>Technical Issue</option>
                    <option>Partnership</option>
                 </select>
              </div>

              <div className="space-y-2">
                 <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
                 <textarea 
                   rows={5}
                   required
                   placeholder="How can we help you today?"
                   className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 outline-none transition-all dark:text-white font-medium resize-none"
                 />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
              >
                {loading ? 'Sending Message...' : 'Send Message'}
                <ArrowRight className="w-6 h-6" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
