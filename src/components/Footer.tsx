import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full py-12 px-6 border-t border-white/5 bg-[#050505] relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-4">
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

        <div className="pt-4">
          <div className="w-12 h-px bg-accent/20 mx-auto" />
        </div>
      </div>
    </footer>
  );
};
