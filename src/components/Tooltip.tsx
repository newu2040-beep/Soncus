import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

interface TooltipProps {
  isVisible: boolean;
  onClose: () => void;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export default function Tooltip({ isVisible, onClose, text, position = 'top', className }: TooltipProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 10 : position === 'bottom' ? -10 : 0 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={cn(
            "absolute z-50 flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--foreground)] text-[var(--background)] shadow-xl",
            position === 'top' ? "bottom-full mb-2 left-1/2 -translate-x-1/2" : "",
            position === 'bottom' ? "top-full mt-2 left-1/2 -translate-x-1/2" : "",
            position === 'left' ? "right-full mr-2 top-1/2 -translate-y-1/2" : "",
            position === 'right' ? "left-full ml-2 top-1/2 -translate-y-1/2" : "",
            className
          )}
        >
          <span className="text-xs font-medium whitespace-nowrap">{text}</span>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-0.5 rounded-full hover:bg-white/20">
            <X className="w-3 h-3" />
          </button>
          
          {/* Arrow */}
          <div className={cn(
            "absolute w-2 h-2 bg-[var(--foreground)] rotate-45",
            position === 'top' ? "bottom-[-4px] left-1/2 -translate-x-1/2" : "",
            position === 'bottom' ? "top-[-4px] left-1/2 -translate-x-1/2" : "",
            position === 'left' ? "right-[-4px] top-1/2 -translate-y-1/2" : "",
            position === 'right' ? "left-[-4px] top-1/2 -translate-y-1/2" : ""
          )} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
