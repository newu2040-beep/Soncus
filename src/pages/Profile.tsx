import { motion } from 'motion/react';
import { Settings, Image as ImageIcon, Heart, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Profile() {
  const navigate = useNavigate();
  const { savedWallpapers, likedWallpapers, uploadedWallpapers } = useStore();

  return (
    <div className="flex flex-col h-full pb-8">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between sticky top-0 bg-[var(--background)]/90 backdrop-blur-md z-10">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">Profile</h2>
        <button 
          onClick={() => navigate('/settings')}
          className="p-2 rounded-full hover:bg-[var(--muted)] transition-colors"
        >
          <Settings className="w-6 h-6 text-[var(--foreground)]" />
        </button>
      </div>

      {/* Profile Info */}
      <div className="px-4 py-6 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--accent)] to-purple-400 p-1 mb-4 shadow-xl shadow-[var(--accent)]/20">
          <div className="w-full h-full rounded-full bg-[var(--surface)] border-4 border-[var(--background)] flex items-center justify-center overflow-hidden">
            <span className="text-3xl font-bold text-[var(--accent)]">R</span>
          </div>
        </div>
        <h3 className="text-xl font-bold text-[var(--foreground)]">Rahul Shah</h3>
        <p className="text-[var(--muted-foreground)]">@rahulshah</p>
        
        <button className="mt-4 px-6 py-2 rounded-full border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
          Edit Profile
        </button>
      </div>

      {/* Stats */}
      <div className="px-4 py-6 grid grid-cols-3 gap-4 border-y border-[var(--border)]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-[var(--muted)] flex items-center justify-center mb-2">
            <ImageIcon className="w-6 h-6 text-[var(--foreground)]" />
          </div>
          <span className="text-lg font-bold text-[var(--foreground)]">{uploadedWallpapers.length}</span>
          <span className="text-xs text-[var(--muted-foreground)]">Uploads</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-[var(--muted)] flex items-center justify-center mb-2">
            <Bookmark className="w-6 h-6 text-[var(--foreground)]" />
          </div>
          <span className="text-lg font-bold text-[var(--foreground)]">{savedWallpapers.length}</span>
          <span className="text-xs text-[var(--muted-foreground)]">Saved</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-[var(--muted)] flex items-center justify-center mb-2">
            <Heart className="w-6 h-6 text-[var(--foreground)]" />
          </div>
          <span className="text-lg font-bold text-[var(--foreground)]">{likedWallpapers.length}</span>
          <span className="text-xs text-[var(--muted-foreground)]">Liked</span>
        </div>
      </div>

      {/* Uploads Grid */}
      <div className="px-4 py-6">
        <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">Your Uploads</h3>
        {uploadedWallpapers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-[var(--surface)] rounded-3xl border border-[var(--border)] border-dashed">
            <ImageIcon className="w-12 h-12 text-[var(--muted-foreground)] mb-3" />
            <p className="text-[var(--muted-foreground)] mb-4">You haven't uploaded any wallpapers yet.</p>
            <button 
              onClick={() => navigate('/upload')}
              className="px-6 py-2 rounded-xl bg-[var(--accent)] text-[var(--accent-foreground)] font-medium text-sm"
            >
              Upload Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {uploadedWallpapers.map(wp => (
              <motion.div
                key={wp.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/wallpaper/${wp.id}`)}
                className="aspect-square rounded-xl overflow-hidden bg-[var(--muted)] cursor-pointer"
              >
                <img src={wp.thumbnail} alt={wp.title} className="w-full h-full object-cover" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
