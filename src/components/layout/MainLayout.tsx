import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import BottomNav from './BottomNav';
import Drawer from './Drawer';
import { Menu, Search, Bell } from 'lucide-react';
import Tooltip from '../Tooltip';
import { useStore } from '../../store/useStore';

export default function MainLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { tooltipsSeen, markTooltipSeen } = useStore();

  return (
    <div className="flex-1 flex flex-col h-full w-full relative">
      {/* Top App Bar */}
      <header className="sticky top-0 z-30 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 relative">
          <div className="relative">
            <button 
              onClick={() => {
                markTooltipSeen('hamburger');
                setIsDrawerOpen(true);
              }}
              className="p-2 -ml-2 rounded-full hover:bg-[var(--muted)] transition-colors relative"
            >
              <Menu className="w-6 h-6 text-[var(--foreground)]" />
            </button>
            <Tooltip 
              isVisible={!tooltipsSeen.hamburger} 
              onClose={() => markTooltipSeen('hamburger')} 
              text="Access themes and settings here" 
              position="bottom"
              className="left-0 translate-x-0"
            />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[var(--foreground)]">Soncus</h1>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-full hover:bg-[var(--muted)] transition-colors">
            <Search className="w-5 h-5 text-[var(--foreground)]" />
          </button>
          <button className="p-2 rounded-full hover:bg-[var(--muted)] transition-colors">
            <Bell className="w-5 h-5 text-[var(--foreground)]" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Side Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}

