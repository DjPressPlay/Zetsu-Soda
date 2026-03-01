import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp, Sparkles, X, Copy, Check, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SODA_DATA, SodaCan, Category } from '../types';
import { generateSodaImage } from '../services/gemini';

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

const SodaCard = ({ can, index, onClick }: { can: SodaCan; index: number; onClick: () => void; key?: React.Key }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="group relative bg-card border border-border rounded-2xl p-3.5 flex items-center gap-4 cursor-pointer transition-all hover:bg-card-hover hover:border-accent/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_0_1px_rgba(0,255,200,0.08)]"
    >
      <div className={`w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl bg-gradient-to-br ${
        can.category === 'analytics' ? 'from-[#0a1628] to-[#0d3060]' :
        can.category === 'automation' ? 'from-[#150a28] to-[#3b0d7a]' :
        can.category === 'apps' ? 'from-[#0a2010] to-[#0d5030]' :
        'from-[#1a0a00] to-[#4d2000]'
      }`}>
        {can.icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-[14.5px] font-medium text-white leading-tight mb-1">{can.name}</h3>
        <p className="text-[11.5px] text-muted leading-relaxed truncate">{can.description}</p>
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
        <h2 className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase">{category.name}</h2>
        <span className="font-mono text-[9px] text-muted-dark ml-auto">{category.cans.length} cans</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {category.cans.map((can, idx) => (
          <SodaCard key={can.id} can={can} index={idx} onClick={() => onCanClick(can)} />
        ))}
      </div>
    </section>
  );
};

const PromptModal = ({ can, onClose }: { can: SodaCan; onClose: () => void }) => {
  const [copied, setCopied] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      setLoadingImage(true);
      const url = await generateSodaImage(can.name, can.category);
      setImageUrl(url);
      setLoadingImage(false);
    };
    loadImage();
  }, [can]);

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
        className="bg-card border border-accent/20 rounded-3xl w-full max-w-sm overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.8)] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-gradient-to-br ${
              can.category === 'analytics' ? 'from-[#0a1628] to-[#0d3060]' :
              can.category === 'automation' ? 'from-[#150a28] to-[#3b0d7a]' :
              can.category === 'apps' ? 'from-[#0a2010] to-[#0d5030]' :
              'from-[#1a0a00] to-[#4d2000]'
            }`}>
              {can.icon}
            </div>
            <div>
              <h3 className="font-display text-xl text-white tracking-wide leading-tight">{can.name}</h3>
              <RarityTag rarity={can.rarity} />
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="relative aspect-square bg-black/20 overflow-hidden flex-shrink-0">
          {loadingImage ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 text-accent animate-spin" />
              <span className="font-mono text-[8px] text-muted uppercase tracking-widest">Generating Atomic Can...</span>
            </div>
          ) : imageUrl ? (
            <motion.img 
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              src={imageUrl} 
              alt={can.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted font-mono text-[10px]">
              Failed to generate image
            </div>
          )}
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="font-mono text-[9px] tracking-[0.2em] text-accent uppercase mb-3">Simplified Prompt</div>
          <div className="bg-black/40 border border-border rounded-xl p-4 relative group">
            <p className="text-xs text-muted leading-relaxed font-mono">
              {can.prompt}
            </p>
            <button 
              onClick={handleCopy}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          
          <div className="mt-6 flex items-center gap-2.5 text-muted">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-[10px] font-mono uppercase tracking-widest">Paste this into AI Studio to build</span>
          </div>
        </div>

        <div className="p-3 bg-accent/5 flex justify-center border-t border-border">
          <button 
            onClick={onClose}
            className="font-display text-base text-accent tracking-widest hover:opacity-80 transition-opacity"
          >
            CLOSE CAN
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function VendingMachine() {
  const [trashLevel, setTrashLevel] = useState(6);
  const [selectedCan, setSelectedCan] = useState<SodaCan | null>(null);
  const [activeCategory, setActiveCategory] = useState('A');
  const maxTrash = 10;

  const categories = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

  return (
    <div className="relative z-10 max-w-[660px] mx-auto px-5 pb-24 pt-10">
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
          <div>
            <div className="font-mono text-[9px] tracking-[0.22em] text-accent uppercase mb-1">⚡ Zetsu Soda</div>
            <h1 className="font-display text-6xl tracking-wider leading-none bg-gradient-to-br from-white to-accent bg-clip-text text-transparent">
              Atomic
            </h1>
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
              onCanClick={(can) => setSelectedCan(can)}
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
          setSelectedCan(randomCan);
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
          />
        )}
      </AnimatePresence>

      {/* Scanline Effect Overlay */}
      <div className="fixed inset-0 pointer-events-none scanline opacity-20" />
    </div>
  );
}
