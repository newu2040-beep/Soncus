import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Heart, Download } from 'lucide-react';
import { MOCK_WALLPAPERS, CATEGORIES } from '../data/mockData';
import { useStore, Wallpaper } from '../store/useStore';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import Tooltip from '../components/Tooltip';

export default function Explore() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const { likedWallpapers, toggleLike, saveWallpaper, tooltipsSeen, markTooltipSeen } = useStore();

  const filteredWallpapers = useMemo(() => {
    return MOCK_WALLPAPERS.filter(wp => {
      const matchesSearch = wp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            wp.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = activeCategory === 'All' || wp.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
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

  const WallpaperCard = ({ wallpaper, className }: { key?: React.Key, wallpaper: Wallpaper, className?: string }) => {
    const isLiked = likedWallpapers.includes(wallpaper.id);
    
    return (
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
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
        
        <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={(e) => handleLike(e, wallpaper.id)}
            className="p-2 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 transition-colors"
          >
            <Heart className={cn("w-4 h-4", isLiked ? "fill-red-500 text-red-500" : "text-white")} />
          </button>
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
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="px-4 pt-4 pb-2 sticky top-0 bg-[var(--background)]/90 backdrop-blur-md z-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search wallpapers, themes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 transition-shadow"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-2 flex overflow-x-auto hide-scrollbar gap-2 sticky top-16 bg-[var(--background)]/90 backdrop-blur-md z-10">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              activeCategory === category 
                ? "bg-[var(--foreground)] text-[var(--background)]" 
                : "bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--muted)]"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-3">
          {filteredWallpapers.filter((_, i) => i % 2 === 0).map(wp => (
            <WallpaperCard key={wp.id} wallpaper={wp} className={cn("w-full", parseInt(wp.id) % 3 === 0 ? "h-64" : "h-48")} />
          ))}
        </div>
        <div className="flex flex-col gap-3">
          {filteredWallpapers.filter((_, i) => i % 2 !== 0).map(wp => (
            <WallpaperCard key={wp.id} wallpaper={wp} className={cn("w-full", parseInt(wp.id) % 2 === 0 ? "h-64" : "h-48")} />
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredWallpapers.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-[var(--muted)] flex items-center justify-center mb-4">
            <Search className="w-10 h-10 text-[var(--muted-foreground)]" />
          </div>
          <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">No wallpapers found</h3>
          <p className="text-[var(--muted-foreground)]">Try adjusting your search or category filter.</p>
        </div>
      )}

      {/* FAB */}
      <div className="fixed bottom-20 right-4 z-20">
        <Tooltip 
          isVisible={!tooltipsSeen.fab} 
          onClose={() => markTooltipSeen('fab')} 
          text="Upload your first wallpaper" 
          position="left"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            markTooltipSeen('fab');
            navigate('/upload');
          }}
          className="w-14 h-14 rounded-full bg-[var(--accent)] text-[var(--accent-foreground)] shadow-lg shadow-[var(--accent)]/30 flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>
    </div>
  );
}

