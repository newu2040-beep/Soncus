import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { MOCK_WALLPAPERS } from '../data/mockData';
import { ChevronDown, Heart, Download, Share2, Info, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export default function WallpaperDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { likedWallpapers, toggleLike, saveWallpaper, uploadedWallpapers } = useStore();
  const [showUI, setShowUI] = useState(true);
  
  const wallpaper = [...MOCK_WALLPAPERS, ...uploadedWallpapers].find(w => w.id === id);
  const isLiked = wallpaper ? likedWallpapers.includes(wallpaper.id) : false;

  useEffect(() => {
    if (!wallpaper) {
      navigate('/', { replace: true });
    }
  }, [wallpaper, navigate]);

  if (!wallpaper) return null;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(wallpaper.id);
    if (!isLiked) toast.success('Added to favorites');
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    saveWallpaper(wallpaper);
    
    // Simulate download
    const toastId = toast.loading('Downloading high-res image...');
    setTimeout(() => {
      toast.success('Saved to gallery', { id: toastId });
    }, 1500);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: wallpaper.title,
          text: `Check out this aesthetic wallpaper on Soncus!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black flex flex-col"
      onClick={() => setShowUI(!showUI)}
    >
      {/* Background Image */}
      <img 
        src={wallpaper.url} 
        alt={wallpaper.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Top Gradient */}
      <AnimatePresence>
        {showUI && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Top Bar */}
      <AnimatePresence>
        {showUI && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-safe left-4 right-4 flex items-center justify-between z-10 pt-4"
          >
            <button 
              onClick={(e) => { e.stopPropagation(); navigate(-1); }}
              className="p-3 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-black/40 transition-colors"
            >
              <ChevronDown className="w-6 h-6" />
            </button>
            <div className="px-4 py-2 rounded-full bg-black/20 backdrop-blur-md text-white text-sm font-medium">
              {wallpaper.resolution}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Gradient & Action Sheet */}
      <AnimatePresence>
        {showUI && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-32 pb-safe-bottom px-6 z-10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">{wallpaper.title}</h1>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <span>By {wallpaper.author}</span>
                <span>•</span>
                <span>{wallpaper.category}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 mb-6">
              <button 
                onClick={handleSave}
                className="flex-1 h-14 rounded-2xl bg-[var(--accent)] text-[var(--accent-foreground)] font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-[var(--accent)]/30 active:scale-95 transition-all"
              >
                <Download className="w-5 h-5" />
                Save to Gallery
              </button>
              <button 
                onClick={handleLike}
                className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center active:scale-95 transition-all"
              >
                <Heart className={cn("w-6 h-6", isLiked ? "fill-red-500 text-red-500" : "text-white")} />
              </button>
            </div>

            <div className="flex items-center justify-around py-4 border-t border-white/10">
              <button className="flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors">
                <ImageIcon className="w-5 h-5" />
                <span className="text-xs font-medium">Set as</span>
              </button>
              <button onClick={handleShare} className="flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors">
                <Share2 className="w-5 h-5" />
                <span className="text-xs font-medium">Share</span>
              </button>
              <button className="flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors">
                <Info className="w-5 h-5" />
                <span className="text-xs font-medium">Info</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
