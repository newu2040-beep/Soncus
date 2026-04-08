import { motion, AnimatePresence } from 'motion/react';
import { X, Home, Compass, Grid, TrendingUp, Settings, Info, Moon, Sun, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Drawer({ isOpen, onClose }: DrawerProps) {
  const navigate = useNavigate();
  const { themeMode, setThemeMode } = useStore();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: Grid, label: 'Collections', path: '/explore?tab=collections' },
    { icon: TrendingUp, label: 'Trending', path: '/explore?tab=trending' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: Info, label: 'About', path: '/settings#about' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-0 left-0 bottom-0 w-3/4 max-w-[300px] bg-[var(--surface)] z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[var(--foreground)]">Soncus</h2>
                <p className="text-sm text-[var(--muted-foreground)]">Discover. Save. Adore.</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--muted)]">
                <X className="w-5 h-5 text-[var(--foreground)]" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.path)}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[var(--muted)] transition-colors text-left"
                >
                  <item.icon className="w-5 h-5 text-[var(--muted-foreground)]" />
                  <span className="font-medium text-[var(--foreground)]">{item.label}</span>
                </button>
              ))}

              <div className="my-4 border-t border-[var(--border)]" />

              {/* Theme Toggle */}
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {themeMode === 'dark' ? (
                    <Moon className="w-5 h-5 text-[var(--muted-foreground)]" />
                  ) : (
                    <Sun className="w-5 h-5 text-[var(--muted-foreground)]" />
                  )}
                  <span className="font-medium text-[var(--foreground)]">Dark Mode</span>
                </div>
                <button
                  onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
                  className={cn(
                    "w-12 h-6 rounded-full p-1 transition-colors relative",
                    themeMode === 'dark' ? "bg-[var(--accent)]" : "bg-[var(--muted-foreground)]"
                  )}
                >
                  <motion.div
                    layout
                    className="w-4 h-4 rounded-full bg-white shadow-sm"
                    animate={{ x: themeMode === 'dark' ? 24 : 0 }}
                  />
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[var(--border)] bg-[var(--muted)]/30">
              <div className="flex items-center justify-center gap-2 text-sm text-[var(--muted-foreground)]">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-400 fill-current" />
                <span>by Rahul Shah</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
