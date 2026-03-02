import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Box, Layers, ArrowRight, Loader2 } from 'lucide-react';
import { SODA_DATA, SodaCan } from '../types';
import { PromptModal } from '../components/PromptModal';
import { Footer } from '../components/Footer';

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
      setDispensedCan({ ...randomCan });
      setIsDispensing(false);
      setTimeout(() => setShowModal(true), 800);
    }, 2000);
  };

  const handleImageGenerated = React.useCallback((url: string) => {
    setDispensedCan(prev => prev ? { ...prev, imageUrl: url } : null);
  }, []);

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12 overflow-hidden bg-[#050505]">
      {/* Background Image with Shaded Filter */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="https://assets.skool.com/f/0f7f15bc8d494ed0b4bfb968b9a216e4/599fab27309e4be9a9519b44f42a5ef417c7d10ace9b400a91dd9e9ae68c3909.png" 
          alt="Background" 
          className="w-full h-full object-cover opacity-25 grayscale-[0.2]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-[#050505]/60 to-[#050505]/90" />
      </div>

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
        <div className="relative w-[300px] md:w-[340px] h-[540px] md:h-[600px] bg-[#080808] rounded-[40px] p-1 shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col overflow-hidden">
          
          {/* Chrome/Gold Outer Frame */}
          <div className="absolute inset-0 rounded-[40px] border-[10px] border-[#1a1a1a] pointer-events-none z-50 shadow-[inset_0_0_15px_rgba(255,255,255,0.1),0_8px_25px_rgba(0,0,0,0.5)]">
            {/* Inner Metallic Bezel */}
            <div className="absolute inset-0 border-[1.5px] border-white/10 rounded-[32px]" />
          </div>

          {/* Chase Lights Frame */}
          <div className="absolute inset-3 rounded-[28px] border border-accent/20 pointer-events-none z-40 overflow-hidden">
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
          <div className="h-20 bg-[#0a0a0a] border-b border-white/5 flex flex-col items-center justify-center px-6 relative z-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-transparent" />
            <img 
              src="https://assets.skool.com/f/0f7f15bc8d494ed0b4bfb968b9a216e4/fe37336d620b48e89ab983bb2f2611f2334f992500b64382b9b4aec650f9a531.png" 
              alt="Zetsu Logo" 
              className="absolute left-4 w-12 h-12 object-contain opacity-20 pointer-events-none"
              referrerPolicy="no-referrer"
            />
            <motion.div 
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center relative z-10"
            >
              <div className="font-mono text-[8px] tracking-[0.3em] text-accent uppercase mb-0.5 font-bold">Zetsu Premium</div>
              <div className="font-display text-2xl tracking-[0.12em] text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]">ATOMIC SLOTS</div>
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
            <div className="relative z-10 flex flex-col gap-4">
              {[0, 1].map((row) => (
                <div key={row} className="flex justify-around items-end h-20 border-b border-white/5 pb-2 relative">
                  {/* Mechanical Shelf */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  {[0, 1, 2].map((col) => (
                    <motion.div 
                      key={col}
                      whileHover={{ y: -3 }}
                      className="w-10 h-14 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-lg border border-white/10 relative overflow-hidden shadow-xl"
                    >
                      <div className="absolute inset-0 flex items-center justify-center text-xl opacity-30 grayscale blur-[0.5px]">
                        {['🥤', '🔋', '⚡', '💎', '🔥', '🌀'][row * 3 + col]}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent/30" />
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
          <div className="h-32 bg-[#0d0d0d] border-t border-white/10 p-4 flex flex-col items-center justify-between relative z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            
            {/* Dispense Slot */}
            <div className="w-48 h-16 bg-black rounded-xl border-2 border-[#1a1a1a] shadow-[inset_0_4px_15px_rgba(0,0,0,1)] flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/[0.02]" />
              <AnimatePresence>
                {dispensedCan && !isDispensing && (
                  <motion.div
                    initial={{ scale: 0, y: 15, rotate: -10 }}
                    animate={{ scale: 1, y: 0, rotate: 0 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="text-4xl cursor-pointer drop-shadow-[0_0_15px_rgba(0,255,200,0.4)]"
                    onClick={() => setShowModal(true)}
                  >
                    {dispensedCan.icon}
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Slot Flap */}
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-b from-white/10 to-transparent" />
            </div>
            
            <div className="font-mono text-[8px] text-muted uppercase tracking-[0.2em] font-bold opacity-50">Collection Bin</div>
          </div>
        </div>

        {/* Physical Style Dispense Button */}
        <div className="mt-6 relative group">
          {/* Button Glow Aura */}
          <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl group-hover:bg-accent/30 transition-all" />
          
          <motion.button
            onClick={handleDispense}
            disabled={isDispensing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9, y: 3 }}
            className={`relative w-20 h-20 rounded-full border-[4px] border-[#1a1a1a] flex flex-col items-center justify-center transition-all shadow-[0_8px_0_#000,0_12px_25px_rgba(0,0,0,0.5)] ${
              isDispensing 
                ? 'bg-[#222] text-muted cursor-not-allowed translate-y-[3px] shadow-[0_5px_0_#000]' 
                : 'bg-gradient-to-b from-accent to-[#00cc99] text-black'
            }`}
          >
            {/* Button Surface Reflection */}
            <div className="absolute inset-1.5 rounded-full border border-white/20 pointer-events-none" />
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-3 bg-white/20 rounded-full blur-[1.5px] pointer-events-none" />
            
            <Zap className={`w-6 h-6 mb-0.5 ${isDispensing ? 'opacity-20' : 'animate-pulse'}`} />
            <span className="font-display text-[8px] tracking-widest font-bold uppercase leading-none">Dispense</span>
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
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 border border-accent/20 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,255,200,0.1)] relative overflow-hidden">
              <img 
                src="https://assets.skool.com/f/0f7f15bc8d494ed0b4bfb968b9a216e4/fe37336d620b48e89ab983bb2f2611f2334f992500b64382b9b4aec650f9a531.png" 
                alt="Zetsu Logo" 
                className="absolute inset-0 w-full h-full object-contain opacity-10 pointer-events-none"
                referrerPolicy="no-referrer"
              />
              <item.icon className="w-7 h-7 text-accent relative z-10" />
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
            onImageGenerated={handleImageGenerated}
          />
        )}
      </AnimatePresence>

      {/* Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none scanline opacity-5" />
      
      <Footer />
      
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
