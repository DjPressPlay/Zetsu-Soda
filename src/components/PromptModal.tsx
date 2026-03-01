import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Copy, Check, Loader2, Download, Share2, RefreshCw } from 'lucide-react';
import { toJpeg } from 'html-to-image';
import { SodaCan } from '../types';
import { generateSodaImage, remixSodaPrompt } from '../services/gemini';
import { SodaCardExport } from './SodaCardExport';

interface PromptModalProps {
  can: SodaCan;
  onClose: () => void;
  pregeneratedImage?: string | null;
  isPregenerating?: boolean;
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

export const PromptModal = ({ can, onClose, pregeneratedImage, isPregenerating }: PromptModalProps) => {
  const [copied, setCopied] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(pregeneratedImage || null);
  const [loadingImage, setLoadingImage] = useState(isPregenerating ?? true);
  const [isShaking, setIsShaking] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(can.prompt);
  const [isRemixing, setIsRemixing] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only generate if we don't have a pre-generated image and aren't already loading one from props
    if (pregeneratedImage) {
      setImageUrl(pregeneratedImage);
      setLoadingImage(false);
      return;
    }

    if (isPregenerating) {
      setLoadingImage(true);
      return;
    }

    const loadImage = async () => {
      setLoadingImage(true);
      const url = await generateSodaImage(can.name, can.category);
      setImageUrl(url);
      setLoadingImage(false);
    };
    loadImage();
  }, [can, pregeneratedImage, isPregenerating]);

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
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const dataUrl = await toJpeg(exportRef.current, { 
        quality: 0.95,
        backgroundColor: '#050505',
        width: 1200,
        height: 630,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
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
    if (isRemixing) return;
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
        className="bg-card border border-accent/20 rounded-3xl w-full max-w-sm overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.8)] max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-gradient-to-br from-accent/20 to-accent-purple/20">
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
          
          {/* Action Overlay */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button 
              onClick={handleDownload}
              className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/80 transition-all"
              title="Download Card"
              disabled={isDownloading}
            >
              {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            </button>
            <button 
              onClick={handleShake}
              className={`p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/80 transition-all ${isRemixing ? 'animate-spin' : ''}`}
              title="Shake Soda (Remix Prompt)"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button 
              onClick={handleShare}
              className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/80 transition-all"
              title="Share Can"
            >
              {isSharing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
          
          {shareLink && (
            <div className="absolute top-4 left-4 right-4 animate-in fade-in slide-in-from-top-2">
              <div className="bg-accent text-black px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold flex items-center justify-between shadow-lg">
                <span>LINK COPIED TO CLIPBOARD</span>
                <Check className="w-3 h-3" />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="font-mono text-[9px] tracking-[0.2em] text-white uppercase mb-3">Simplified Prompt</div>
          <div className="bg-black/40 border border-border rounded-xl p-4 relative group">
            <p className="text-xs text-muted leading-relaxed font-mono">
              {isRemixing ? "Remixing prompt..." : currentPrompt}
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

      {/* Hidden Export Component */}
      <div style={{ position: 'fixed', left: '-9999px', top: '-9999px', pointerEvents: 'none' }}>
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
