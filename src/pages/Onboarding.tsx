import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { ChevronRight, Sparkles, Download, Palette } from 'lucide-react';
import { cn } from '../lib/utils';

const SLIDES = [
  {
    id: 'discover',
    title: 'Welcome to Soncus',
    description: 'Discover stunning aesthetic wallpapers curated just for you.',
    icon: Sparkles,
    color: 'from-purple-400 to-pink-400',
  },
  {
    id: 'save',
    title: 'Save to Gallery',
    description: 'One-tap save directly to your device gallery in high resolution.',
    icon: Download,
    color: 'from-blue-400 to-cyan-400',
  },
  {
    id: 'customize',
    title: 'Make it yours',
    description: 'Switch themes, explore collections, and personalize your experience.',
    icon: Palette,
    color: 'from-orange-400 to-rose-400',
  },
];

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const completeOnboarding = useStore((state) => state.completeOnboarding);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    completeOnboarding();
    navigate('/', { replace: true });
  };

  return (
    <div className="flex-1 flex flex-col bg-[var(--background)] relative overflow-hidden">
      {/* Skip Button */}
      <div className="absolute top-safe right-4 z-10 pt-4">
        <button 
          onClick={handleComplete}
          className="px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Slides */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
          >
            <div className={cn(
              "w-48 h-48 rounded-full mb-12 flex items-center justify-center bg-gradient-to-br shadow-2xl",
              SLIDES[currentIndex].color
            )}>
              {(() => {
                const Icon = SLIDES[currentIndex].icon;
                return <Icon className="w-24 h-24 text-white" strokeWidth={1.5} />;
              })()}
            </div>
            
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">
              {SLIDES[currentIndex].title}
            </h2>
            <p className="text-lg text-[var(--muted-foreground)] max-w-xs">
              {SLIDES[currentIndex].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="p-8 pb-safe-bottom flex flex-col items-center gap-8">
        {/* Indicators */}
        <div className="flex items-center gap-2">
          {SLIDES.map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === currentIndex 
                  ? "w-8 bg-[var(--accent)]" 
                  : "w-2 bg-[var(--border)]"
              )}
            />
          ))}
        </div>

        {/* Action Button */}
        <button
          onClick={handleNext}
          className="w-full max-w-xs h-14 rounded-2xl bg-[var(--accent)] text-[var(--accent-foreground)] font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-[var(--accent)]/25 active:scale-95 transition-all"
        >
          {currentIndex === SLIDES.length - 1 ? (
            'Get Started'
          ) : (
            <>
              Next
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
