import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useStore } from './store/useStore';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Pages
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Saved from './pages/Saved';
import Profile from './pages/Profile';
import WallpaperDetail from './pages/WallpaperDetail';
import Upload from './pages/Upload';
import Settings from './pages/Settings';

export default function App() {
  const { themeMode, accentColor, hasCompletedOnboarding } = useStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(themeMode);
    
    // Remove all theme classes
    root.classList.forEach((className) => {
      if (className.startsWith('theme-')) {
        root.classList.remove(className);
      }
    });
    // Add current theme class
    root.classList.add(`theme-${accentColor}`);
  }, [themeMode, accentColor]);

  return (
    <BrowserRouter>
      <div className="min-h-screen w-full max-w-md mx-auto relative bg-[var(--background)] shadow-2xl overflow-hidden flex flex-col">
        <Routes>
          <Route path="/splash" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          
          {/* Main App Routes */}
          <Route path="/" element={
            hasCompletedOnboarding ? <MainLayout /> : <Navigate to="/splash" replace />
          }>
            <Route index element={<Home />} />
            <Route path="explore" element={<Explore />} />
            <Route path="saved" element={<Saved />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          
          {/* Full Screen Routes */}
          <Route path="/wallpaper/:id" element={<WallpaperDetail />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/settings" element={<Settings />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        <Toaster 
          position="top-center" 
          toastOptions={{
            className: 'bg-[var(--surface)] text-[var(--foreground)] border-[var(--border)] rounded-2xl shadow-lg',
          }}
        />
      </div>
    </BrowserRouter>
  );
}
