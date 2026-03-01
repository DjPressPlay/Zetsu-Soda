import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { PromptModal } from '../components/PromptModal';
import { SodaCan } from '../types';

export default function SharedCan() {
  const { id } = useParams<{ id: string }>();
  const [can, setCan] = useState<SodaCan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCan = async () => {
      try {
        const response = await fetch(`/api/share/${id}`);
        if (!response.ok) throw new Error("Can not found");
        const data = await response.json();
        setCan(data);
      } catch (err) {
        setError("This soda can doesn't exist or has been removed.");
      } finally {
        setLoading(false);
      }
    };
    fetchCan();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white">
        <Loader2 className="w-10 h-10 text-accent animate-spin mb-4" />
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/60">Retrieving Atomic Can...</p>
      </div>
    );
  }

  if (error || !can) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white px-6 text-center">
        <div className="text-6xl mb-6 opacity-20">📭</div>
        <h1 className="font-display text-3xl mb-4 tracking-widest text-accent-pink uppercase">404: CAN NOT FOUND</h1>
        <p className="text-white/60 mb-8 max-w-md leading-relaxed">{error}</p>
        <Link to="/" className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-mono text-xs uppercase tracking-widest">
          Return to Vending Machine
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Image with Shaded Filter */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="https://assets.skool.com/f/0f7f15bc8d494ed0b4bfb968b9a216e4/599fab27309e4be9a9519b44f42a5ef417c7d10ace9b400a91dd9e9ae68c3909.png" 
          alt="Background" 
          className="w-full h-full object-cover opacity-30 grayscale-[0.3]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-[#050505]/70 to-[#050505]/90" />
      </div>

      {/* Background Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-accent/5 rounded-full blur-[200px] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md flex flex-col items-center"
      >
        <div className="mb-12 flex flex-col items-center text-center">
          <div className="font-mono text-[10px] tracking-[0.4em] text-accent uppercase mb-3 font-bold">Shared Atomic Edition</div>
          <h1 className="font-display text-5xl tracking-widest text-white mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">ZETSU SODA</h1>
          <div className="flex items-center gap-2 text-white/60 font-mono text-[10px] uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-accent" />
            <span>A component by Zetsu Systems</span>
          </div>
        </div>

        {/* The Card is shown via PromptModal logic but we want it static here */}
        <div className="w-full">
           <PromptModal can={can} onClose={() => {}} />
        </div>

        <div className="mt-12">
          <Link 
            to="/" 
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all font-mono text-xs uppercase tracking-[0.2em]"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Machine</span>
          </Link>
        </div>
      </motion.div>

      {/* Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none scanline opacity-5" />
    </div>
  );
}
