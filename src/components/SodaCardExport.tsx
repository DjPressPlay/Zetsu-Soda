import React from 'react';
import { SodaCan } from '../types';
import { Sparkles } from 'lucide-react';

interface SodaCardExportProps {
  can: SodaCan;
  imageUrl: string;
  prompt: string;
}

export const SodaCardExport = React.forwardRef<HTMLDivElement, SodaCardExportProps>(
  ({ can, imageUrl, prompt }, ref) => {
    const rarityStyles = {
      Common: 'text-muted border-muted/30',
      Rare: 'text-[#b08aff] border-[#b08aff]/30',
      Epic: 'text-[#ff8aaa] border-[#ff8aaa]/30',
    };

    return (
      <div 
        ref={ref}
        style={{ width: '1200px', height: '630px' }}
        className="relative bg-[#050505] overflow-hidden flex font-sans"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent-purple/5" />
        <div className="absolute inset-0 opacity-20 pointer-events-none scanline" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,200,0.05),transparent_70%)]" />

        {/* Left Side: Image */}
        <div className="relative w-[550px] h-full p-8 flex items-center justify-center">
          <div className="relative w-full h-full rounded-[40px] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
            <img 
              src={imageUrl} 
              alt={can.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Rarity Badge on Image */}
            <div className={`absolute bottom-6 left-6 px-4 py-1.5 rounded-full border backdrop-blur-md bg-black/40 font-mono text-xs font-bold tracking-[0.2em] uppercase ${rarityStyles[can.rarity]}`}>
              {can.rarity}
            </div>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 h-full p-12 flex flex-col justify-between relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl relative overflow-hidden bg-gradient-to-br from-accent/20 to-accent-purple/20 border border-white/5">
              <img 
                src="https://assets.skool.com/f/0f7f15bc8d494ed0b4bfb968b9a216e4/fe37336d620b48e89ab983bb2f2611f2334f992500b64382b9b4aec650f9a531.png" 
                alt="Zetsu Logo" 
                className="absolute inset-0 w-full h-full object-contain opacity-10 pointer-events-none"
                referrerPolicy="no-referrer"
              />
              <span className="relative z-10">{can.icon}</span>
            </div>
              <div>
                <div className="font-mono text-[10px] tracking-[0.3em] text-accent uppercase mb-1">⚡ Zetsu Soda</div>
                <h1 className="font-display text-5xl text-white tracking-wider leading-tight">{can.name}</h1>
              </div>
            </div>

            <div className="gline mb-8 opacity-30" />

            <div className="space-y-6">
              <div>
                <div className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase mb-3 flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-accent" />
                  Atomic Prompt
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative">
                  <p className="text-sm text-white leading-relaxed font-mono italic">
                    "{prompt}"
                  </p>
                </div>
              </div>

              <div className="flex gap-8">
                <div>
                  <div className="font-mono text-[9px] tracking-[0.2em] text-white/60 uppercase mb-1">Category</div>
                  <div className="text-white font-medium capitalize">{can.category}</div>
                </div>
                <div>
                  <div className="font-mono text-[9px] tracking-[0.2em] text-white/60 uppercase mb-1">Edition</div>
                  <div className="text-white font-medium">Atomic A-01</div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="font-mono text-[9px] tracking-[0.1em] text-accent/60 uppercase mb-1">Atomic Integration</div>
                <div className="text-[10px] text-white/40 font-mono leading-tight">
                  Bring this prompt to life at <span className="text-accent">aistudio.google.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div className="font-display text-3xl tracking-widest text-white/10 select-none">
              ZETSU.IO
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] text-white/60 uppercase tracking-widest">Generated by</div>
              <div className="font-mono text-xs text-accent">Gemini Atomic Engine</div>
            </div>
          </div>
        </div>

        {/* Decorative Corner Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-purple/5 blur-3xl rounded-full -ml-16 -mb-16" />
      </div>
    );
  }
);

SodaCardExport.displayName = 'SodaCardExport';
