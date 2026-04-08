import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, Upload as UploadIcon, X, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { CATEGORIES } from '../data/mockData';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export default function Upload() {
  const navigate = useNavigate();
  const { uploadWallpaper } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!preview || !title) return;

    setIsUploading(true);

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newWallpaper = {
      id: `uploaded-${Date.now()}`,
      url: preview,
      thumbnail: preview,
      title,
      category,
      tags: ['uploaded'],
      resolution: 'HD',
      author: 'You',
      createdAt: Date.now(),
    };

    uploadWallpaper(newWallpaper);
    setIsUploading(false);
    toast.success('Wallpaper uploaded successfully!');
    navigate('/profile', { replace: true });
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
        <h2 className="text-xl font-bold text-[var(--foreground)]">Upload Wallpaper</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Image Upload Area */}
          <div 
            onClick={() => !preview && fileInputRef.current?.click()}
            className={cn(
              "relative w-full aspect-[3/4] rounded-3xl border-2 border-dashed overflow-hidden transition-colors",
              preview ? "border-transparent" : "border-[var(--border)] hover:border-[var(--accent)] bg-[var(--surface)] cursor-pointer flex flex-col items-center justify-center"
            )}
          >
            {preview ? (
              <>
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreview(null);
                  }}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-[var(--muted)] flex items-center justify-center mb-4">
                  <UploadIcon className="w-8 h-8 text-[var(--accent)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">Tap to select image</h3>
                <p className="text-sm text-[var(--muted-foreground)]">Soncus accepts HD and 4K images only. Max size 10MB.</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pastel Dreams"
                className="w-full h-12 px-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 transition-shadow"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Category</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.filter(c => c !== 'All').map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                      category === cat 
                        ? "bg-[var(--accent)] text-[var(--accent-foreground)]" 
                        : "bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] hover:bg-[var(--muted)]"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quality Notice */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20">
            <CheckCircle2 className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5" />
            <p className="text-sm text-[var(--foreground)]">
              By uploading, you confirm this image is high quality and you have the right to share it.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!preview || !title || isUploading}
            className="w-full h-14 rounded-2xl bg-[var(--accent)] text-[var(--accent-foreground)] font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-[var(--accent)]/25 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            {isUploading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Upload Wallpaper'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
