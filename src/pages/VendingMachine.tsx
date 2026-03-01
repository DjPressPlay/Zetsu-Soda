import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, Sparkles, X, Copy, Check, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SODA_DATA, SodaCan, Category } from '../types';
import { PromptModal } from '../components/PromptModal';
import { generateSodaImage } from '../services/gemini';

const SodaCard = ({ can, index, onClick }: { can: SodaCan; index: number; onClick: () => void; key?: React.Key }) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="group relative bg-card border border-border rounded-2xl p-3.5 flex items-center gap-4 cursor-pointer transition-all hover:bg-card-hover hover:border-accent/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_0_1px_rgba(0,255,200,0.08)]"
    >
      <div className={`w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl relative overflow-hidden bg-gradient-to-br ${
        can.category === 'analytics' ? 'from-[#0a1628] to-[#0d3060]' :
        can.category === 'automation' ? 'from-[#150a28] to-[#3b0d7a]' :
        can.category === 'apps' ? 'from-[#0a2010] to-[#0d5030]' :
        'from-[#1a0a00] to-[#4d2000]'
      }`}>
        <img 
          src="https://assets.skool.com/f/0f7f15bc8d494ed0b4bfb968b9a216e4/fe37336d620b48e89ab983bb2f2611f2334f992500b64382b9b4aec650f9a531.png" 
          alt="Zetsu Logo" 
          className="absolute inset-0 w-full h-full object-contain opacity-10 pointer-events-none"
          referrerPolicy="no-referrer"
        />
        <span className="relative z-10">{can.icon}</span>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-[14.5px] font-medium text-white leading-tight mb-1">{can.name}</h3>
        <p className="text-[11.5px] text-white/70 leading-relaxed truncate">{can.description}</p>
        <div className="flex gap-1.5 mt-1.5">
          <RarityTag rarity={can.rarity} />
        </div>
      </div>

      <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 transition-all group-hover:bg-accent group-hover:border-accent group-hover:text-black group-hover:shadow-[0_0_18px_rgba(0,255,200,0.45)] text-muted">
        <ArrowUp className="w-4 h-4 rotate-45" />
      </div>
    </motion.div>
  );
};

const CategorySection = ({ category, onCanClick }: { category: Category; onCanClick: (can: SodaCan) => void; key?: React.Key }) => {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="text-base">{category.icon}</span>
        <h2 className="font-mono text-[10px] tracking-[0.18em] text-white/80 uppercase">{category.name}</h2>
        <span className="font-mono text-[9px] text-white/40 ml-auto">{category.cans.length} cans</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {category.cans.map((can, idx) => (
          <SodaCard key={can.id} can={can} index={idx} onClick={() => onCanClick(can)} />
        ))}
      </div>
    </section>
  );
};

export default function VendingMachine() {
  const [trashLevel, setTrashLevel] = useState(6);
  const [selectedCan, setSelectedCan] = useState<SodaCan | null>(null);
  const [activeCategory, setActiveCategory] = useState('A');
  const [imageState, setImageState] = useState<Record<string, { url: string | null; loading: boolean }>>({});
  const maxTrash = 10;

  const handleCanClick = async (can: SodaCan) => {
    setSelectedCan(can);
    
    // Start generating image immediately if not already generating/generated
    if (!imageState[can.id]) {
      setImageState(prev => ({ ...prev, [can.id]: { url: null, loading: true } }));
      try {
        const url = await generateSodaImage(can.name, can.category);
        setImageState(prev => ({ ...prev, [can.id]: { url, loading: false } }));
      } catch (error) {
        console.error("Failed to pre-generate image:", error);
        setImageState(prev => ({ ...prev, [can.id]: { url: null, loading: false } }));
      }
    }
  };

  const categories = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  return (
    <div className="relative z-10 max-w-[660px] mx-auto px-5 pb-24 pt-10">
      {/* Background Image with Shaded Filter */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <img 
          src="https://assets.skool.com/f/0f7f15bc8d494ed0b4bfb968b9a216e4/599fab27309e4be9a9519b44f42a5ef417c7d10ace9b400a91dd9e9ae68c3909.png" 
          alt="Background" 
          className="w-full h-full object-cover opacity-40 grayscale-[0.5]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/95 via-[#050505]/80 to-[#050505]/95" />
      </div>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 font-mono text-[10px] uppercase tracking-widest text-muted hover:bg-white/10 hover:text-white transition-all">
            Home
          </Link>
          <div className="flex flex-col items-end gap-1">
            <div className="font-display text-3xl tracking-widest text-accent-pink leading-none">Edition A</div>
            <div className="font-mono text-[9px] text-muted tracking-widest">28 cans · Category {activeCategory}</div>
          </div>
        </div>

        <div className="flex items-end justify-between mb-6">
          <div className="flex items-center gap-4">
            <img 
              src="https://assets.skool.com/f/0f7f15bc8d494ed0b4bfb968b9a216e4/fe37336d620b48e89ab983bb2f2611f2334f992500b64382b9b4aec650f9a531.png" 
              alt="Zetsu Soda Logo" 
              className="w-16 h-16 object-contain"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="font-mono text-[9px] tracking-[0.22em] text-accent uppercase mb-1">⚡ Zetsu Soda</div>
              <h1 className="font-display text-6xl tracking-wider leading-none bg-gradient-to-br from-white to-accent bg-clip-text text-transparent">
                Atomic
              </h1>
            </div>
          </div>
        </div>

        {/* Categories List Header */}
        <div className="flex flex-col gap-4 py-2">
          <div className="gline" />
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
            <span className="font-mono text-[10px] text-muted uppercase tracking-widest flex-shrink-0">Categories:</span>
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-10 h-10 rounded-lg font-display text-xl flex items-center justify-center transition-all border flex-shrink-0 ${
                    activeCategory === cat 
                      ? 'bg-accent text-black border-accent shadow-[0_0_15px_rgba(0,255,200,0.3)]' 
                      : 'bg-white/5 text-muted border-white/10 hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="gline" />
        </div>
      </header>

      {/* Trash Meter */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-border rounded-2xl p-4 px-5 mb-10 flex items-center gap-4"
      >
        <div className="text-xl">♻️</div>
        <div className="flex-1">
          <div className="flex justify-between mb-2">
            <span className="font-mono text-[9px] tracking-[0.18em] text-muted uppercase">Trash Meter</span>
            <span className="font-mono text-[10px] text-accent-pink">{trashLevel} / {maxTrash} → Gift Can</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(trashLevel / maxTrash) * 100}%` }}
              className="h-full bg-gradient-to-r from-accent-pink to-[#ff7a50] rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <main>
        {activeCategory === 'A' ? (
          SODA_DATA.map((category) => (
            <CategorySection 
              key={category.id} 
              category={category} 
              onCanClick={handleCanClick}
            />
          ))
        ) : (
          <div className="py-20 text-center">
            <div className="text-4xl mb-4 opacity-20">📭</div>
            <p className="font-mono text-xs text-muted-dark uppercase tracking-widest">No cans in Category {activeCategory} yet</p>
          </div>
        )}
      </main>

      {/* Footer CTA */}
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          const allCans = SODA_DATA.flatMap(c => c.cans);
          const randomCan = allCans[Math.floor(Math.random() * allCans.length)];
          handleCanClick(randomCan);
        }}
        className="mt-10 bg-gradient-to-br from-accent/10 to-accent-purple/10 border border-accent/20 rounded-2xl p-6 flex items-center justify-between cursor-pointer group transition-all hover:from-accent/15 hover:to-accent-purple/15 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      >
        <div className="flex flex-col gap-1">
          <span className="font-display text-2xl tracking-wider text-accent">Dispense Random Can</span>
          <span className="text-xs text-muted">Let the machine pick. Anything can drop.</span>
        </div>
        <div className="text-4xl group-hover:scale-110 transition-transform">🥤</div>
      </motion.div>

      {/* Prompt Modal */}
      <AnimatePresence>
        {selectedCan && (
          <PromptModal 
            can={selectedCan} 
            onClose={() => setSelectedCan(null)} 
            pregeneratedImage={imageState[selectedCan.id]?.url}
            isPregenerating={imageState[selectedCan.id]?.loading}
          />
        )}
      </AnimatePresence>

      {/* Scanline Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none scanline opacity-20" />
    </div>
  );
}
