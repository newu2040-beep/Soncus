import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Moon, Sun, Bell, Trash2, Shield, FileText, Heart } from 'lucide-react';
import { useStore, ThemeMode, AccentColor } from '../store/useStore';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const THEMES: { id: AccentColor; name: string; color: string }[] = [
  { id: 'lavender', name: 'Lavender', color: '#C9B8F4' },
  { id: 'rose', name: 'Rose', color: '#F4B8D8' },
  { id: 'mint', name: 'Mint', color: '#B8F4E8' },
  { id: 'peach', name: 'Peach', color: '#F4D0B8' },
  { id: 'sky', name: 'Sky', color: '#B8D8F4' },
  { id: 'lilac', name: 'Lilac', color: '#E2B8F4' },
];

export default function Settings() {
  const navigate = useNavigate();
  const { themeMode, setThemeMode, accentColor, setAccentColor } = useStore();

  const handleClearCache = () => {
    toast.success('Cache cleared successfully');
  };

  return (
    <div className="flex flex-col h-full bg-[var(--background)]">
      {/* Header */}
      <div className="px-4 py-4 flex items-center gap-4 sticky top-0 bg-[var(--background)]/90 backdrop-blur-md z-10 border-b border-[var(--border)]">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-[var(--muted)] transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-[var(--foreground)]" />
        </button>
        <h2 className="text-xl font-bold text-[var(--foreground)]">Settings</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-8 flex flex-col gap-8">
        
        {/* Appearance */}
        <section>
          <h3 className="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-4 px-2">Appearance</h3>
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden">
            {/* Dark Mode Toggle */}
            <div className="px-4 py-4 flex items-center justify-between border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--muted)]">
                  {themeMode === 'dark' ? <Moon className="w-5 h-5 text-[var(--foreground)]" /> : <Sun className="w-5 h-5 text-[var(--foreground)]" />}
                </div>
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

            {/* Accent Color */}
            <div className="px-4 py-4">
              <span className="font-medium text-[var(--foreground)] block mb-4">Accent Color</span>
              <div className="flex flex-wrap gap-3">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setAccentColor(theme.id)}
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-transform active:scale-95",
                      accentColor === theme.id ? "ring-2 ring-offset-2 ring-[var(--foreground)] ring-offset-[var(--surface)]" : ""
                    )}
                    style={{ backgroundColor: theme.color }}
                  >
                    {accentColor === theme.id && <div className="w-4 h-4 rounded-full bg-white/90" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section>
          <h3 className="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-4 px-2">Preferences</h3>
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden flex flex-col">
            <button className="px-4 py-4 flex items-center justify-between hover:bg-[var(--muted)] transition-colors border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--muted)]">
                  <Bell className="w-5 h-5 text-[var(--foreground)]" />
                </div>
                <span className="font-medium text-[var(--foreground)]">Notifications</span>
              </div>
              <ChevronLeft className="w-5 h-5 text-[var(--muted-foreground)] rotate-180" />
            </button>
            <button onClick={handleClearCache} className="px-4 py-4 flex items-center justify-between hover:bg-[var(--muted)] transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--muted)]">
                  <Trash2 className="w-5 h-5 text-[var(--foreground)]" />
                </div>
                <span className="font-medium text-[var(--foreground)]">Clear Cache</span>
              </div>
            </button>
          </div>
        </section>

        {/* About */}
        <section id="about">
          <h3 className="text-sm font-bold text-[var(--muted-foreground)] uppercase tracking-wider mb-4 px-2">About</h3>
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden flex flex-col">
            <button className="px-4 py-4 flex items-center justify-between hover:bg-[var(--muted)] transition-colors border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--muted)]">
                  <Shield className="w-5 h-5 text-[var(--foreground)]" />
                </div>
                <span className="font-medium text-[var(--foreground)]">Privacy Policy</span>
              </div>
              <ChevronLeft className="w-5 h-5 text-[var(--muted-foreground)] rotate-180" />
            </button>
            <button className="px-4 py-4 flex items-center justify-between hover:bg-[var(--muted)] transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[var(--muted)]">
                  <FileText className="w-5 h-5 text-[var(--foreground)]" />
                </div>
                <span className="font-medium text-[var(--foreground)]">Terms of Service</span>
              </div>
              <ChevronLeft className="w-5 h-5 text-[var(--muted-foreground)] rotate-180" />
            </button>
          </div>
        </section>

        {/* Developer Credit */}
        <div className="mt-4 p-6 rounded-3xl bg-gradient-to-br from-[var(--accent)]/10 to-transparent border border-[var(--accent)]/20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/20 flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-[var(--accent)]">S</span>
          </div>
          <h4 className="text-lg font-bold text-[var(--foreground)] mb-1">Soncus v1.0.0</h4>
          <p className="text-sm text-[var(--muted-foreground)] mb-4">Discover. Save. Adore.</p>
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)] bg-[var(--surface)] px-4 py-2 rounded-full border border-[var(--border)]">
            Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by Rahul Shah
          </div>
        </div>

      </div>
    </div>
  );
}
