import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore';

export default function Splash() {
  const navigate = useNavigate();
  const hasCompletedOnboarding = useStore((state) => state.hasCompletedOnboarding);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasCompletedOnboarding) {
        navigate('/', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate, hasCompletedOnboarding]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[var(--background)]">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: 'spring', 
          damping: 15, 
          stiffness: 100,
          duration: 0.8 
        }}
        className="flex flex-col items-center"
      >
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[var(--accent)] to-purple-400 flex items-center justify-center shadow-2xl shadow-[var(--accent)]/30 mb-6">
          <span className="text-4xl font-bold text-white">S</span>
        </div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold tracking-tight text-[var(--foreground)]"
        >
          Soncus
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[var(--muted-foreground)] mt-2 font-medium"
        >
          Discover. Save. Adore.
        </motion.p>
      </motion.div>
    </div>
  );
}
