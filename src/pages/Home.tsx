import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Heart, Download } from 'lucide-react';
import { MOCK_WALLPAPERS, COLLECTIONS } from '../data/mockData';
import { useStore, Wallpaper } from '../store/useStore';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import Tooltip from '../components/Tooltip';

export default function Home() {
  const navigate = useNavigate();
  const { likedWallpapers, toggleLike, saveWallpaper, tooltipsSeen, markTooltipSeen } = useStore();
  const [heroIndex, setHeroIndex] = useState(0);

  const heroWallpapers = MOCK_WALLPAPERS.slice(0, 3);
  const trendingWallpapers = MOCK_WALLPAPERS.slice(3, 8);
  const newArrivals = MOCK_WALLPAPERS.slice(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroWallpapers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroWallpapers.length]);

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    markTooltipSeen('heart');
    toggleLike(id);
    const isLiked = !likedWallpapers.includes(id);
    if (isLiked) {
      toast.success('Added to favorites');
    }
  };

  const handleSave = (e: React.MouseEvent, wallpaper: Wallpaper) => {
    e.stopPropagation();
    saveWallpaper(wallpaper);
    toast.success('Saved to gallery');
  };

  const WallpaperCard = ({ wallpaper, className, showTooltip = false }: { key?: React.Key, wallpaper: Wallpaper, className?: string, showTooltip?: boolean }) => {
    const isLiked = likedWallpapers.includes(wallpaper.id);
    
    return (
      <motion.div 
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate(`/wallpaper/${wallpaper.id}`)}
        className={cn("relative rounded-2xl overflow-hidden group cursor-pointer bg-[var(--muted)]", className)}
      >
        <img 
          src={wallpaper.thumbnail} 
          alt={wallpaper.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-md">
          <span className="text-[10px] font-medium text-white">{wallpaper.category}</span>
        </div>

        <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="relative">
            <button 
              onClick={(e) => handleLike(e, wallpaper.id)}
              className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-colors"
            >
              <Heart className={cn("w-4 h-4", isLiked ? "fill-red-500 text-red-500" : "text-white")} />
            </button>
            {showTooltip && (
              <Tooltip 
                isVisible={!tooltipsSeen.heart} 
                onClose={() => markTooltipSeen('heart')} 
                text="Tap to like and save" 
                position="top"
              />
            )}
          </div>
          <button 
            onClick={(e) => handleSave(e, wallpaper)}
            className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-colors"
          >
            <Download className="w-4 h-4 text-white" />
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Hero Carousel */}
      <section className="px-4 pt-4">
        <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg">
          <AnimatePresence mode="wait">
            <motion.img
              key={heroIndex}
              src={heroWallpapers[heroIndex].url}
              alt="Hero"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
            <motion.div
              key={`text-${heroIndex}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-white"
            >
              <span className="px-3 py-1 rounded-full bg-[var(--accent)]/80 backdrop-blur-sm text-xs font-medium mb-3 inline-block">
                Featured
              </span>
              <h2 className="text-2xl font-bold mb-1">{heroWallpapers[heroIndex].title}</h2>
              <p className="text-sm text-white/80">By {heroWallpapers[heroIndex].author}</p>
            </motion.div>
          </div>
          {/* Carousel Indicators */}
          <div className="absolute bottom-6 right-6 flex gap-1.5">
            {heroWallpapers.map((_, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  idx === heroIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Today */}
      <section>
        <div className="px-4 flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[var(--foreground)]">Trending Today</h3>
          <button onClick={() => navigate('/explore?tab=trending')} className="text-sm font-medium text-[var(--accent)]">See All</button>
        </div>
        <div className="flex overflow-x-auto hide-scrollbar px-4 gap-4 pb-4">
          {trendingWallpapers.map((wp, idx) => (
            <WallpaperCard key={wp.id} wallpaper={wp} className="w-32 h-48 flex-shrink-0" showTooltip={idx === 0} />
          ))}
        </div>
      </section>

      {/* Collections */}
      <section>
        <div className="px-4 flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[var(--foreground)]">Collections</h3>
        </div>
        <div className="flex overflow-x-auto hide-scrollbar px-4 gap-4 pb-4">
          {COLLECTIONS.map((collection) => (
            <motion.div
              key={collection.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/explore?collection=${collection.id}`)}
              className="relative w-40 h-24 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer group"
            >
              <img src={collection.image} alt={collection.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <span className="text-white font-semibold text-sm tracking-wide">{collection.title}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* New Arrivals (Masonry-ish) */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[var(--foreground)]">New Arrivals</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-3">
            {newArrivals.filter((_, i) => i % 2 === 0).map(wp => (
              <WallpaperCard key={wp.id} wallpaper={wp} className={cn("w-full", parseInt(wp.id) % 3 === 0 ? "h-64" : "h-48")} />
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {newArrivals.filter((_, i) => i % 2 !== 0).map(wp => (
              <WallpaperCard key={wp.id} wallpaper={wp} className={cn("w-full", parseInt(wp.id) % 2 === 0 ? "h-64" : "h-48")} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
