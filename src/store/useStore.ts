import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';
export type AccentColor = 'lavender' | 'rose' | 'mint' | 'peach' | 'sky' | 'lilac';

export interface Wallpaper {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  category: string;
  tags: string[];
  resolution: string;
  author: string;
  createdAt: number;
}

interface AppState {
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
  
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
  
  savedWallpapers: Wallpaper[];
  saveWallpaper: (wallpaper: Wallpaper) => void;
  removeSavedWallpaper: (id: string) => void;
  
  likedWallpapers: string[]; // array of IDs
  toggleLike: (id: string) => void;
  
  uploadedWallpapers: Wallpaper[];
  uploadWallpaper: (wallpaper: Wallpaper) => void;
  
  tooltipsSeen: {
    fab: boolean;
    heart: boolean;
    hamburger: boolean;
  };
  markTooltipSeen: (tooltip: keyof AppState['tooltipsSeen']) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      
      themeMode: 'light',
      setThemeMode: (mode) => set({ themeMode: mode }),
      
      accentColor: 'lavender',
      setAccentColor: (color) => set({ accentColor: color }),
      
      savedWallpapers: [],
      saveWallpaper: (wallpaper) => set((state) => ({
        savedWallpapers: state.savedWallpapers.some(w => w.id === wallpaper.id) 
          ? state.savedWallpapers 
          : [wallpaper, ...state.savedWallpapers]
      })),
      removeSavedWallpaper: (id) => set((state) => ({
        savedWallpapers: state.savedWallpapers.filter(w => w.id !== id)
      })),
      
      likedWallpapers: [],
      toggleLike: (id) => set((state) => ({
        likedWallpapers: state.likedWallpapers.includes(id)
          ? state.likedWallpapers.filter(wId => wId !== id)
          : [...state.likedWallpapers, id]
      })),
      
      uploadedWallpapers: [],
      uploadWallpaper: (wallpaper) => set((state) => ({
        uploadedWallpapers: [wallpaper, ...state.uploadedWallpapers]
      })),
      
      tooltipsSeen: {
        fab: false,
        heart: false,
        hamburger: false,
      },
      markTooltipSeen: (tooltip) => set((state) => ({
        tooltipsSeen: { ...state.tooltipsSeen, [tooltip]: true }
      })),
    }),
    {
      name: 'soncus-storage',
    }
  )
);
