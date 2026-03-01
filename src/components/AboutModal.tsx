import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Info, Code, Cpu, Sparkles } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-accent/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display text-2xl tracking-tight text-white">About Atomic Soda</h2>
                  <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">System Specification v1.0.4</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 max-h-[70vh] overflow-y-auto no-scrollbar space-y-10">
              {/* How it Works */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-accent">
                  <Cpu className="w-4 h-4" />
                  <h3 className="font-mono text-xs uppercase tracking-[0.2em] font-bold">How it Works</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
                    <div className="text-xl">🧪</div>
                    <h4 className="text-sm font-medium text-white">Molecular Synthesis</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Each soda is synthesized in real-time based on its unique chemical profile (prompt). The system generates a visual representation of the can using advanced diffusion models.
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
                    <div className="text-xl">⚡</div>
                    <h4 className="text-sm font-medium text-white">Atomic Dispensing</h4>
                    <p className="text-xs text-white/50 leading-relaxed">
                      The vending machine uses a randomized distribution algorithm to ensure rare and epic cans are dispensed with appropriate scarcity.
                    </p>
                  </div>
                </div>
              </section>

              {/* How it's Made */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-accent-purple">
                  <Code className="w-4 h-4" />
                  <h3 className="font-mono text-xs uppercase tracking-[0.2em] font-bold">How it's Made</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {['React 18', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Gemini API', 'Lucide Icons'].map(tech => (
                        <span key={tech} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-white/60">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Atomic Soda is a high-performance web application built with a focus on immersive UI/UX. It leverages the <span className="text-white">Gemini 3.1 Flash</span> model for dynamic image generation and creative text synthesis. The interface is crafted using <span className="text-white">Tailwind CSS</span> for precision styling and <span className="text-white">Framer Motion</span> for fluid, hardware-accelerated animations.
                    </p>
                  </div>
                </div>
              </section>

              {/* The Vision */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-accent-pink">
                  <Sparkles className="w-4 h-4" />
                  <h3 className="font-mono text-xs uppercase tracking-[0.2em] font-bold">The Vision</h3>
                </div>
                <p className="text-sm text-white/70 italic leading-relaxed pl-4 border-l-2 border-accent-pink/30">
                  "To bridge the gap between digital scarcity and physical desire through the medium of atomic-scale carbonated beverages."
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="p-6 bg-white/5 border-t border-white/5 flex items-center justify-between">
              <div className="font-mono text-[9px] text-white/20 uppercase tracking-widest">
                Zetsu Systems Division
              </div>
              <button 
                onClick={onClose}
                className="px-6 py-2 rounded-xl bg-accent text-black font-mono text-[10px] uppercase font-bold tracking-widest hover:shadow-[0_0_20px_rgba(0,255,200,0.4)] transition-all"
              >
                Acknowledge
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
