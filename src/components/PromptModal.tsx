import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Copy, Check, Loader2, Download, Share2, RefreshCw } from 'lucide-react';
import { toJpeg } from 'html-to-image';
import { SodaCan } from '../types';
import { generateSodaImage, remixSodaPrompt, pourSodaPrompt } from '../services/gemini';
import { SodaCardExport } from './SodaCardExport';

interface PromptModalProps {
  can: SodaCan;
  onClose: () => void;
  pregeneratedImage?: string | null;
  isPregenerating?: boolean;
  onImageGenerated?: (url: string) => void;
}

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

export const PromptModal = ({ can, onClose, pregeneratedImage, isPregenerating, onImageGenerated }: PromptModalProps) => {
  const [copied, setCopied] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(pregeneratedImage || can.imageUrl || null);
  const [loadingImage, setLoadingImage] = useState(() => {
    if (pregeneratedImage || can.imageUrl) return false;
    if (isPregenerating) return true;
    return true;
  });
  const [isShaking, setIsShaking] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(can.prompt);
  const [isRemixing, setIsRemixing] = useState(false);
  const [isPouring, setIsPouring] = useState(false);
  const [isHoveringShake, setIsHoveringShake] = useState(false);
  const [isHoveringPour, setIsHoveringPour] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. If we already have an image in the local state, we're good.
    if (imageUrl) {
      setLoadingImage(false);
      return;
    }

    // 2. If the can prop or pregenerated prop already has an image, use it.
    const existingUrl = can.imageUrl || pregeneratedImage;
    if (existingUrl) {
      setImageUrl(existingUrl);
      setLoadingImage(false);
      return;
    }

    // 3. If we're already pre-generating in the parent, wait for it.
    if (isPregenerating) {
      setLoadingImage(true);
      return;
    }

    // 4. Only load if we really have to.
    let isMounted = true;
    const loadImage = async () => {
      setLoadingImage(true);
      try {
        const url = await generateSodaImage(can.name, can.category);
        if (isMounted && url) {
          setImageUrl(url);
          setLoadingImage(false);
          onImageGenerated?.(url);
        }
      } catch (error) {
        console.error("Failed to load soda image:", error);
        if (isMounted) setLoadingImage(false);
      }
    };

    loadImage();
    return () => { isMounted = false; };
  }, [can.id, can.name, can.category, can.imageUrl, pregeneratedImage, isPregenerating, onImageGenerated, imageUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!exportRef.current || !imageUrl) return;
    setIsDownloading(true);
    try {
      // Small delay to ensure styles are applied
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dataUrl = await toJpeg(exportRef.current, { 
        quality: 0.95,
        backgroundColor: '#050505',
        width: 1200,
        height: 630,
        cacheBust: true,
        includeQueryParams: true,
        pixelRatio: 1,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          visibility: 'visible',
          display: 'flex'
        }
      });

      const link = document.createElement('a');
      link.download = `${can.name.replace(/\s+/g, '_')}_Zetsu_Card.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download card:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShake = async () => {
    if (isRemixing || isPouring) return;
    setIsShaking(true);
    setIsRemixing(true);
    
    // Short CSS animation delay
    setTimeout(async () => {
      setIsShaking(false);
      const remixed = await remixSodaPrompt(currentPrompt);
      setCurrentPrompt(remixed);
      setIsRemixing(false);
    }, 1000);
  };

  const handlePour = async () => {
    if (isRemixing || isPouring) return;
    setIsPouring(true);
    
    const detailed = await pourSodaPrompt(currentPrompt);
    setCurrentPrompt(detailed);
    setIsPouring(false);
  };

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: can.name,
          category: can.category,
          prompt: currentPrompt,
          rarity: can.rarity,
          icon: can.icon,
          imageUrl: imageUrl
        })
      });
      const data = await response.json();
      const link = `${window.location.origin}/share/${data.id}`;
      setShareLink(link);
      navigator.clipboard.writeText(link);
      setTimeout(() => setShareLink(null), 5000);
    } catch (error) {
      console.error("Error sharing can:", error);
    } finally {
      setIsSharing(false);
    }
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
        animate={{ 
          scale: 1, 
          opacity: 1, 
          y: 0,
          x: isShaking ? [0, -10, 10, -10, 10, 0] : 0
        }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-black/60 backdrop-blur-xl border border-accent/20 rounded-3xl w-full max-w-md overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.8)] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          {loadingImage ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
              <span className="font-mono text-[10px] text-accent uppercase tracking-widest">Generating Atomic Can...</span>
            </div>
          ) : imageUrl ? (
            <>
              <motion.img 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={imageUrl} 
                alt={can.name}
                className="w-full h-full object-cover opacity-60"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted font-mono text-[10px] bg-black/40">
              No background data
            </div>
          )}
        </div>

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between backdrop-blur-md bg-black/20">
            <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg relative overflow-hidden bg-gradient-to-br from-accent/20 to-accent-purple/20">
              <img 
                src="https://assets.skool.com/f/0f7f15bc8d494ed0b4bfb968b9a216e4/fe37336d620b48e89ab983bb2f2611f2334f992500b64382b9b4aec650f9a531.png" 
                alt="Zetsu Logo" 
                className="absolute inset-0 w-full h-full object-contain opacity-10 pointer-events-none"
                referrerPolicy="no-referrer"
              />
              <span className="relative z-10">{can.icon}</span>
            </div>
            <div>
              <h3 className="font-display text-xl text-white tracking-wide leading-tight">{can.name}</h3>
              <RarityTag rarity={can.rarity} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDownload}
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted hover:bg-white/10 hover:text-white transition-colors"
              title="Download Card"
              disabled={isDownloading}
            >
              {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            </button>
            <button 
              onClick={handleShare}
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted hover:bg-white/10 hover:text-white transition-colors"
              title="Share Can"
            >
              {isSharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Spacer to show the background can art */}
        <div 
          className="relative h-80 flex-shrink-0 group/img cursor-zoom-in" 
          onClick={() => imageUrl && setShowFullImage(true)}
        >
          <div className="absolute inset-0 bg-black/10 group-hover/img:bg-transparent transition-colors" />
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity pointer-events-none">
            <span className="font-mono text-[10px] text-white uppercase tracking-[0.2em] bg-black/60 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
              Click to Enlarge
            </span>
          </div>
          
          {shareLink && (
            <div className="absolute top-4 left-4 right-4 animate-in fade-in slide-in-from-top-2 z-20">
              <div className="bg-accent text-black px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold flex items-center justify-between shadow-lg">
                <span>LINK COPIED TO CLIPBOARD</span>
                <Check className="w-3 h-3" />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 flex flex-col min-h-0">
          <div className="font-mono text-[9px] tracking-[0.2em] text-white uppercase mb-3">Atomic Prompt Data</div>
          <div className="bg-black/40 border border-border rounded-xl p-5 relative group flex-1 flex flex-col">
            <div className="overflow-y-auto flex-1 custom-scrollbar pr-8">
              <p className="text-sm text-white leading-relaxed font-mono">
                {isRemixing ? (
                  <motion.span
                    animate={{ 
                      opacity: [0.3, 1, 0.3],
                      filter: ["blur(0px)", "blur(1px)", "blur(0px)"]
                    }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="text-accent"
                  >
                    {">"} REMIXING_ATOMIC_DATA...
                  </motion.span>
                ) : isPouring ? (
                  <motion.span
                    animate={{ 
                      opacity: [0.3, 1, 0.3],
                      filter: ["blur(0px)", "blur(1px)", "blur(0px)"]
                    }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="text-accent-purple"
                  >
                    {">"} POURING_DETAILED_DATA...
                  </motion.span>
                ) : currentPrompt}
              </p>
            </div>
            <button 
              onClick={handleCopy}
              className="absolute top-4 right-4 p-2.5 rounded-lg bg-accent/10 text-accent hover:bg-accent/30 transition-all z-10 border border-accent/20"
              title="Copy Prompt"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Action Row at the Bottom */}
        <div className="px-4 py-3 flex flex-wrap gap-2 justify-center border-t border-border">
          <motion.button
            onMouseEnter={() => setIsHoveringShake(true)}
            onMouseLeave={() => setIsHoveringShake(false)}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(0, 255, 200, 0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShake}
            disabled={isRemixing || isPouring}
            className="flex-1 min-w-[100px] h-10 rounded-full border border-accent/30 flex items-center justify-center gap-2 group transition-all overflow-hidden px-3"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-accent ${isRemixing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-accent whitespace-nowrap">
              {isHoveringShake ? "Remix" : "Shake"}
            </span>
          </motion.button>

          <motion.button
            onMouseEnter={() => setIsHoveringPour(true)}
            onMouseLeave={() => setIsHoveringPour(false)}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(176, 138, 255, 0.1)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePour}
            disabled={isRemixing || isPouring}
            className="flex-1 min-w-[100px] h-10 rounded-full border border-accent-purple/30 flex items-center justify-center gap-2 group transition-all overflow-hidden px-3"
          >
            <Sparkles className={`w-3.5 h-3.5 text-accent-purple ${isPouring ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-accent-purple whitespace-nowrap">
              {isHoveringPour ? "Detailed" : "Pour"}
            </span>
          </motion.button>

          <motion.a
            href="https://aistudio.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 min-w-[100px] h-10 rounded-full border border-white/20 flex items-center justify-center gap-2 group transition-all overflow-hidden px-3"
          >
            <Share2 className="w-3.5 h-3.5 text-white/70 group-hover:text-white transition-colors" />
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-white/70 group-hover:text-white whitespace-nowrap">
              AI Studio
            </span>
          </motion.a>
        </div>

        <div className="p-3 flex justify-center border-t border-border">
          <button 
            onClick={onClose}
            className="font-display text-base text-accent tracking-widest hover:opacity-80 transition-opacity"
          >
            CLOSE CAN
          </button>
        </div>
      </div>
    </motion.div>

      {/* Full Screen Image Preview */}
      <AnimatePresence>
        {showFullImage && imageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFullImage(false)}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={imageUrl}
              alt={can.name}
              className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden Export Component */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '1200px', height: '630px', overflow: 'hidden', pointerEvents: 'none', opacity: 0, zIndex: -1 }}>
        {imageUrl && (
          <SodaCardExport 
            ref={exportRef}
            can={can}
            imageUrl={imageUrl}
            prompt={currentPrompt}
          />
        )}
      </div>
    </motion.div>
  );
};
