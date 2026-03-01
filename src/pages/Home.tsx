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
  const [shake, setShake] = useState(false);

  const handleDispense = () => {
    if (isDispensing) return;
    
    setIsDispensing(true);
    setDispensedCan(null);
    setShake(true);
    setTimeout(() => setShake(false), 500);

    // Pick a random can
    const allCans = SODA_DATA.flatMap(cat => cat.cans);
    const randomCan = allCans[Math.floor(Math.random() * allCans.length)];

    setTimeout(() => {
      setDispensedCan(randomCan);
      setIsDispensing(false);
      setTimeout(() => setShowModal(true), 800);
    }, 2000);
  };

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12 overflow-hidden bg-[#050505]">
      {/* Background Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-accent/5 rounded-full blur-[200px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          x: shake ? [0, -2, 2, -2, 2, 0] : 0
        }}
        transition={{ duration: 0.5 }}
        className="relative z-20 flex flex-col items-center"
      >
        {/* Vending Machine Cabinet */}
        <div className="relative w-[340px] md:w-[420px] h-[620px] md:h-[700px] bg-[#080808] rounded-[50px] p-1 shadow-[0_0_120px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
          
          {/* Chrome/Gold Outer Frame */}
          <div className="absolute inset-0 rounded-[50px] border-[14px] border-[#1a1a1a] pointer-events-none z-50 shadow-[inset_0_0_20px_rgba(255,255,255,0.1),0_10px_30px_rgba(0,0,0,0.5)]">
            {/* Inner Metallic Bezel */}
            <div className="absolute inset-0 border-[2px] border-white/10 rounded-[38px]" />
          </div>

          {/* Chase Lights Frame */}
          <div className="absolute inset-4 rounded-[34px] border border-accent/20 pointer-events-none z-40 overflow-hidden">
            <div className="absolute inset-0 flex flex-wrap gap-4 p-1 opacity-40">
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    opacity: [0.2, 1, 0.2],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: i * 0.1 
                  }}
                  className="w-1 h-1 rounded-full bg-accent shadow-[0_0_8px_rgba(0,255,200,0.8)]"
                />
              ))}
            </div>
          </div>

          {/* Top Marquee */}
          <div className="h-24 bg-[#0a0a0a] border-b border-white/5 flex flex-col items-center justify-center px-8 relative z-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-transparent" />
            <motion.div 
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center relative z-10"
            >
              <div className="font-mono text-[9px] tracking-[0.4em] text-accent uppercase mb-1 font-bold">Zetsu Premium</div>
              <div className="font-display text-3xl tracking-[0.15em] text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">ATOMIC SLOTS</div>
            </motion.div>
            {/* Reflection */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 skew-x-[-45deg] translate-x-[-50%]" />
          </div>

          {/* Main Display Area (Glass) */}
          <div className="flex-1 bg-[#020202] relative p-8 flex flex-col gap-6 overflow-hidden">
            {/* Glass Glare */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.07] pointer-events-none z-20" />
            <div className="absolute top-0 left-[-100%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent skew-x-[-25deg] pointer-events-none z-20 animate-[glare_8s_infinite]" />

            {/* Internal Lighting */}
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-accent-purple/10 to-transparent pointer-events-none" />

            {/* Rows of Cans */}
            <div className="relative z-10 flex flex-col gap-8">
              {[0, 1].map((row) => (
                <div key={row} className="flex justify-around items-end h-28 border-b border-white/5 pb-4 relative">
                  {/* Mechanical Shelf */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  {[0, 1, 2].map((col) => (
                    <motion.div 
                      key={col}
                      whileHover={{ y: -5 }}
                      className="w-14 h-20 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-xl border border-white/10 relative overflow-hidden shadow-2xl"
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-30 grayscale blur-[1px]">
                        {['🥤', '🔋', '⚡', '💎', '🔥', '🌀'][row * 3 + col]}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-accent/30" />
                      {/* Coil Visual */}
                      <div className="absolute inset-x-0 bottom-2 h-10 border-b-2 border-white/5 rounded-full rotate-[-15deg] opacity-20" />
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>

            {/* Dispensing Animation Area */}
            <div className="absolute inset-x-0 bottom-0 h-40 flex items-center justify-center overflow-hidden z-30">
              <AnimatePresence>
                {isDispensing && (
                  <motion.div
                    initial={{ y: -150, rotate: -10, opacity: 0, scale: 0.8 }}
                    animate={{ 
                      y: 0, 
                      rotate: [0, 90, 180, 270, 360], 
                      opacity: 1,
                      scale: 1 
                    }}
                    exit={{ y: 200, opacity: 0, scale: 1.2 }}
                    transition={{ 
                      y: { duration: 1.2, ease: "easeOut" },
                      rotate: { duration: 1.2, ease: "linear" },
                      opacity: { duration: 0.3 }
                    }}
                    className="w-20 h-28 bg-gradient-to-br from-accent via-accent-purple to-accent-pink rounded-2xl shadow-[0_0_50px_rgba(0,255,200,0.6)] flex flex-col items-center justify-center border-2 border-white/30"
                  >
                    <div className="text-4xl mb-1 drop-shadow-lg">🥤</div>
                    <div className="font-mono text-[8px] text-black font-bold tracking-tighter bg-white/90 px-2 rounded">ZETSU</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Control Panel & Slot */}
          <div className="h-44 bg-[#0d0d0d] border-t border-white/10 p-6 flex flex-col items-center justify-between relative z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            
            {/* Dispense Slot */}
            <div className="w-56 h-20 bg-black rounded-2xl border-2 border-[#1a1a1a] shadow-[inset_0_4px_20px_rgba(0,0,0,1)] flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/[0.02]" />
              <AnimatePresence>
                {dispensedCan && !isDispensing && (
                  <motion.div
                    initial={{ scale: 0, y: 20, rotate: -10 }}
                    animate={{ scale: 1, y: 0, rotate: 0 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="text-5xl cursor-pointer drop-shadow-[0_0_20px_rgba(0,255,200,0.4)]"
                    onClick={() => setShowModal(true)}
                  >
                    {dispensedCan.icon}
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Slot Flap */}
              <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-b from-white/10 to-transparent" />
            </div>
            
            <div className="font-mono text-[9px] text-muted uppercase tracking-[0.3em] font-bold opacity-50">Collection Bin</div>
          </div>
        </div>

        {/* Physical Style Dispense Button */}
        <div className="mt-10 relative group">
          {/* Button Glow Aura */}
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-2xl group-hover:bg-accent/30 transition-all" />
          
          <motion.button
            onClick={handleDispense}
            disabled={isDispensing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9, y: 4 }}
            className={`relative w-28 h-28 rounded-full border-[6px] border-[#1a1a1a] flex flex-col items-center justify-center transition-all shadow-[0_10px_0_#000,0_15px_30px_rgba(0,0,0,0.5)] ${
              isDispensing 
                ? 'bg-[#222] text-muted cursor-not-allowed translate-y-[4px] shadow-[0_6px_0_#000]' 
                : 'bg-gradient-to-b from-accent to-[#00cc99] text-black'
            }`}
          >
            {/* Button Surface Reflection */}
            <div className="absolute inset-2 rounded-full border border-white/30 pointer-events-none" />
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-white/20 rounded-full blur-[2px] pointer-events-none" />
            
            <Zap className={`w-8 h-8 mb-1 ${isDispensing ? 'opacity-20' : 'animate-pulse'}`} />
            <span className="font-display text-[10px] tracking-widest font-bold uppercase leading-none">Dispense</span>
          </motion.button>
          
          {/* Button Label */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] text-accent font-bold tracking-[0.2em] uppercase whitespace-nowrap opacity-60">
            Press to Play
          </div>
        </div>

        {/* Catalog Link */}
        <div className="mt-16">
          <Link 
            to="/vending-machine" 
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-muted hover:text-white hover:bg-white/10 transition-all font-mono text-xs uppercase tracking-[0.2em] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span>View Full Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>

      {/* Info Section - Casino Style */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full px-6 relative z-10">
        {[
          { icon: Sparkles, title: "Jackpot Logic", desc: "Every dispense is a guaranteed win for your project workflow." },
          { icon: Box, title: "High Stakes UI", desc: "Premium components designed for maximum user engagement." },
          { icon: Layers, title: "House Advantage", desc: "Built on Zetsu OS for unfair performance advantages." }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="p-8 rounded-[32px] bg-gradient-to-b from-[#111] to-[#080808] border border-white/5 flex flex-col items-center text-center group hover:border-accent/30 transition-all shadow-2xl"
          >
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 border border-accent/20 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,255,200,0.1)]">
              <item.icon className="w-7 h-7 text-accent" />
            </div>
            <h3 className="font-display text-xl text-white mb-3 tracking-widest uppercase">{item.title}</h3>
            <p className="text-muted text-sm leading-relaxed font-medium">{item.desc}</p>
          </motion.div>
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
      <div className="fixed inset-0 pointer-events-none scanline opacity-5" />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glare {
          0% { transform: translateX(-100%) skewX(-25deg); }
          20% { transform: translateX(200%) skewX(-25deg); }
          100% { transform: translateX(200%) skewX(-25deg); }
        }
      `}} />
    </div>
  );
}
