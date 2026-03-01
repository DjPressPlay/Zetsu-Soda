import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Box, Layers, ArrowRight, X, Copy, Check } from 'lucide-react';
import { SODA_DATA, SodaCan } from '../types';

const RarityTag = ({ rarity }: { rarity: SodaCan['rarity'] }) => {
  const styles = {
    Common: 'bg-muted/20 text-muted',
    Rare: 'bg-accent-purple/20 text-[#b08aff]',
    Epic: 'bg-accent-pink/20 text-[#ff8aaa]',
  };

  return (
    <span className={`font-mono text-[8px] tracking-wider px-2 py-0.5 rounded-full uppercase ${styles[rarity]}`}>
      {rarity}
    </span>
  );
};

const PromptModal = ({ can, onClose }: { can: SodaCan; onClose: () => void }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(can.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-bg/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-card border border-accent/20 rounded-3xl w-full max-w-lg overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.8)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br from-accent/20 to-accent-purple/20">
              {can.icon}
            </div>
            <div>
              <h3 className="font-display text-2xl text-white tracking-wide">{can.name}</h3>
              <RarityTag rarity={can.rarity} />
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          <div className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase mb-4">Simplified Prompt</div>
          <div className="bg-black/40 border border-border rounded-2xl p-6 relative group">
            <p className="text-sm text-muted leading-relaxed font-mono">
              {can.prompt}
            </p>
            <button 
              onClick={handleCopy}
              className="absolute top-4 right-4 p-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          
          <div className="mt-8 flex items-center gap-3 text-muted">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-[11px] font-mono uppercase tracking-widest">Paste this into AI Studio to build</span>
          </div>
        </div>

        <div className="p-4 bg-accent/5 flex justify-center">
          <button 
            onClick={onClose}
            className="font-display text-lg text-accent tracking-widest hover:opacity-80 transition-opacity"
          >
            CLOSE CAN
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Home() {
  const [isDispensing, setIsDispensing] = useState(false);
  const [dispensedCan, setDispensedCan] = useState<SodaCan | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDispense = () => {
    if (isDispensing) return;
    
    setIsDispensing(true);
    setDispensedCan(null);

    // Pick a random can
    const allCans = SODA_DATA.flatMap(cat => cat.cans);
    const randomCan = allCans[Math.floor(Math.random() * allCans.length)];

    setTimeout(() => {
      setDispensedCan(randomCan);
      setIsDispensing(false);
      setTimeout(() => setShowModal(true), 600);
    }, 1500);
  };

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12 overflow-hidden">
      {/* Background Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[160px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-20 flex flex-col items-center"
      >
        {/* Vending Machine Body */}
        <div className="relative w-[320px] md:w-[380px] h-[580px] md:h-[640px] bg-[#0a0a0a] border-[12px] border-[#1a1a1a] rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.8),inset_0_0_40px_rgba(0,255,200,0.05)] overflow-hidden flex flex-col">
          
          {/* Top Display */}
          <div className="h-20 bg-[#111] border-b border-white/5 flex items-center justify-center px-8 relative">
            <div className="absolute inset-0 bg-accent/5 animate-pulse" />
            <div className="text-center relative z-10">
              <div className="font-mono text-[8px] tracking-[0.3em] text-accent uppercase mb-1">Zetsu Systems</div>
              <div className="font-display text-2xl tracking-widest text-white">ATOMIC SODA</div>
            </div>
          </div>

          {/* Glass Window Area */}
          <div className="flex-1 bg-[#050505] relative p-6 flex flex-col gap-4">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
            
            {/* Rows of Cans (Visual Only) */}
            {[0, 1, 2].map((row) => (
              <div key={row} className="flex justify-between items-end h-24 border-b border-white/5 pb-2">
                {[0, 1, 2].map((col) => (
                  <div key={col} className="w-12 h-16 bg-gradient-to-t from-[#111] to-[#222] rounded-lg border border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-xl opacity-40 grayscale">
                      {['🥤', '🔋', '⚡', '💎', '🔥', '🌀', '🧪', '🧠', '🌌'][row * 3 + col]}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent/20" />
                  </div>
                ))}
              </div>
            ))}

            {/* Dispensing Animation Area */}
            <div className="absolute inset-x-0 bottom-0 h-32 flex items-center justify-center overflow-hidden">
              <AnimatePresence>
                {isDispensing && (
                  <motion.div
                    initial={{ y: -100, rotate: 0, opacity: 0 }}
                    animate={{ y: 0, rotate: 360, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 1, ease: "easeIn" }}
                    className="w-16 h-24 bg-gradient-to-br from-accent to-accent-purple rounded-xl shadow-[0_0_30px_rgba(0,255,200,0.5)] flex items-center justify-center text-3xl"
                  >
                    🥤
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Dispense Slot */}
          <div className="h-32 bg-[#111] border-t border-white/5 p-4 flex flex-col items-center justify-center relative">
            <div className="w-48 h-16 bg-black rounded-xl border border-white/10 shadow-inner flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5" />
              <AnimatePresence>
                {dispensedCan && !isDispensing && (
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="text-4xl cursor-pointer hover:scale-110 transition-transform"
                    onClick={() => setShowModal(true)}
                  >
                    {dispensedCan.icon}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="mt-2 font-mono text-[8px] text-muted uppercase tracking-widest">Collection Slot</div>
          </div>
        </div>

        {/* Controls Side Panel (Visual) */}
        <div className="mt-8 flex flex-col items-center gap-6">
          <button
            onClick={handleDispense}
            disabled={isDispensing}
            className={`group relative px-12 py-5 rounded-2xl font-display text-2xl tracking-[0.2em] transition-all active:scale-95 ${
              isDispensing 
                ? 'bg-muted/20 text-muted cursor-not-allowed' 
                : 'bg-accent text-black hover:shadow-[0_0_40px_rgba(0,255,200,0.5)]'
            }`}
          >
            {isDispensing ? 'DISPENSING...' : 'DISPENSE CAN'}
            {!isDispensing && (
              <div className="absolute -top-1 -right-1">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-black"></span>
                </span>
              </div>
            )}
          </button>

          <div className="flex items-center gap-4">
            <Link 
              to="/vending-machine" 
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-muted hover:text-white hover:bg-white/10 transition-all font-mono text-xs uppercase tracking-widest"
            >
              Browse Catalog <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Info Section */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full px-6 relative z-10">
        {[
          { icon: Zap, title: "Atomic Speed", desc: "Instant component generation for rapid prototyping." },
          { icon: Box, title: "Modular Architecture", desc: "Every soda is a self-contained, production-ready module." },
          { icon: Layers, title: "Scalable OS", desc: "Designed to power the next generation of atomic apps." }
        ].map((item, i) => (
          <div key={i} className="p-6 rounded-3xl bg-card border border-border flex flex-col items-center text-center group hover:border-accent/20 transition-all">
            <item.icon className="w-8 h-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-display text-lg text-white mb-2 tracking-wide uppercase">{item.title}</h3>
            <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showModal && dispensedCan && (
          <PromptModal 
            can={dispensedCan} 
            onClose={() => setShowModal(false)} 
          />
        )}
      </AnimatePresence>

      {/* Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none scanline opacity-10" />
    </div>
  );
}
