import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, List, Trash2, Bookmark } from 'lucide-react';
import { useStore } from '../store/useStore';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export default function Saved() {
  const navigate = useNavigate();
  const { savedWallpapers, removeSavedWallpaper } = useStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
    if (newSelected.size === 0) {
      setIsSelectionMode(false);
    }
  };

  const handleLongPress = (id: string) => {
    setIsSelectionMode(true);
    toggleSelection(id);
  };

  const handleDeleteSelected = () => {
    selectedIds.forEach(id => removeSavedWallpaper(id));
    setSelectedIds(new Set());
    setIsSelectionMode(false);
    toast.success(`Removed ${selectedIds.size} wallpapers`);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between sticky top-0 bg-[var(--background)]/90 backdrop-blur-md z-10">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Saved</h2>
        
        {isSelectionMode ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[var(--muted-foreground)]">
              {selectedIds.size} selected
            </span>
            <button 
              onClick={handleDeleteSelected}
              className="p-2 rounded-full text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => {
                setIsSelectionMode(false);
                setSelectedIds(new Set());
              }}
              className="text-sm font-medium text-[var(--foreground)]"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-[var(--surface)] p-1 rounded-xl border border-[var(--border)]">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                viewMode === 'grid' ? "bg-[var(--background)] shadow-sm" : "text-[var(--muted-foreground)]"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                viewMode === 'list' ? "bg-[var(--background)] shadow-sm" : "text-[var(--muted-foreground)]"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {savedWallpapers.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 rounded-full bg-[var(--muted)] flex items-center justify-center mb-4">
            <Bookmark className="w-10 h-10 text-[var(--muted-foreground)]" />
          </div>
          <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">No saved wallpapers</h3>
          <p className="text-[var(--muted-foreground)] mb-6">Your saved wallpapers will appear here.</p>
          <button 
            onClick={() => navigate('/explore')}
            className="px-6 py-3 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] font-medium"
          >
            Explore Wallpapers
          </button>
        </div>
      ) : (
        <div className={cn(
          "p-4 gap-3",
          viewMode === 'grid' ? "grid grid-cols-3" : "flex flex-col"
        )}>
          <AnimatePresence>
            {savedWallpapers.map(wp => (
              <motion.div
                key={wp.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  "relative rounded-2xl overflow-hidden group cursor-pointer bg-[var(--muted)]",
                  viewMode === 'grid' ? "aspect-[2/3]" : "h-24 flex flex-row items-center p-2 gap-4"
                )}
                onClick={() => {
                  if (isSelectionMode) {
                    toggleSelection(wp.id);
                  } else {
                    navigate(`/wallpaper/${wp.id}`);
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleLongPress(wp.id);
                }}
              >
                <img 
                  src={wp.thumbnail} 
                  alt={wp.title}
                  className={cn(
                    "object-cover transition-transform duration-500",
                    viewMode === 'grid' ? "w-full h-full group-hover:scale-105" : "w-20 h-20 rounded-xl"
                  )}
                  loading="lazy"
                />
                
                {viewMode === 'list' && (
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[var(--foreground)] truncate">{wp.title}</h4>
                    <p className="text-sm text-[var(--muted-foreground)]">{wp.category}</p>
                  </div>
                )}

                {isSelectionMode && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                      selectedIds.has(wp.id) 
                        ? "bg-[var(--accent)] border-[var(--accent)]" 
                        : "border-white bg-black/20"
                    )}>
                      {selectedIds.has(wp.id) && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
