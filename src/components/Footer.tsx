import React, { useState } from 'react';
import { AboutModal } from './AboutModal';
import { Info } from 'lucide-react';

export const Footer = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <footer className="w-full py-12 px-6 border-t border-white/5 bg-[#050505] relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-6">
        <div className="font-mono text-[10px] tracking-[0.15em] text-white/40 uppercase">
          Zetsumetsu EOe™ | Zetsu EDU™ | Zetsu R&D ⓒ | © 2024 - 2026 Zetsumetsu Corporation™ | Artworqq Kevin Suber
        </div>
        
        <div className="space-y-1">
          <div className="font-mono text-[10px] tracking-[0.1em] text-white/60 uppercase font-bold">
            © 2026 Zetsumetsu Corporation™
          </div>
          <div className="font-mono text-[9px] tracking-[0.05em] text-white/30 uppercase">
            All systems, products, and materials are the property of Zetsumetsu Corporation.
          </div>
          <div className="font-mono text-[9px] tracking-[0.05em] text-white/30 uppercase">
            Unauthorized use or reproduction is prohibited.
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={() => setIsAboutOpen(true)}
            className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 font-mono text-[10px] uppercase tracking-widest text-white/60 hover:bg-white/10 hover:text-accent hover:border-accent/30 transition-all"
          >
            <Info className="w-3 h-3 transition-transform group-hover:scale-110" />
            About System
          </button>
          
          <div className="w-12 h-px bg-accent/20" />
        </div>
      </div>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </footer>
  );
};
