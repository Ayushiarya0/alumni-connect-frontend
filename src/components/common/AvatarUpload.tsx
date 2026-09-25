import React, { useRef, useState, useCallback } from 'react';
import { Upload, Camera, Trash2, X, Check, Image as ImageIcon, User } from 'lucide-react';

// Default avatar catalogue — professional illustrated / abstract options
export const DEFAULT_AVATARS = [
  {
    id: 'av-pro-male-1',
    label: 'Professional Male',
    url: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4&style=circle',
    category: 'Professional',
  },
  {
    id: 'av-pro-female-1',
    label: 'Professional Female',
    url: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Lily&backgroundColor=ffd5dc&style=circle',
    category: 'Professional',
  },
  {
    id: 'av-student-male',
    label: 'Student Male',
    url: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Alex&backgroundColor=c0aede&style=circle',
    category: 'Student',
  },
  {
    id: 'av-student-female',
    label: 'Student Female',
    url: 'https://api.dicebear.com/8.x/avataaars/svg?seed=Sara&backgroundColor=d1f4e0&style=circle',
    category: 'Student',
  },
  {
    id: 'av-abstract-1',
    label: 'Abstract Indigo',
    url: 'https://api.dicebear.com/8.x/shapes/svg?seed=Bruno&backgroundColor=6366f1',
    category: 'Abstract',
  },
  {
    id: 'av-abstract-2',
    label: 'Abstract Teal',
    url: 'https://api.dicebear.com/8.x/shapes/svg?seed=Kira&backgroundColor=14b8a6',
    category: 'Abstract',
  },
  {
    id: 'av-abstract-3',
    label: 'Abstract Amber',
    url: 'https://api.dicebear.com/8.x/shapes/svg?seed=Milo&backgroundColor=f59e0b',
    category: 'Abstract',
  },
  {
    id: 'av-bottts-1',
    label: 'Tech Bot',
    url: 'https://api.dicebear.com/8.x/bottts/svg?seed=Cody&backgroundColor=dbeafe',
    category: 'Fun',
  },
  {
    id: 'av-bottts-2',
    label: 'Space Bot',
    url: 'https://api.dicebear.com/8.x/bottts/svg?seed=Luna&backgroundColor=f3e8ff',
    category: 'Fun',
  },
  {
    id: 'av-lorelei-1',
    label: 'Minimal Male',
    url: 'https://api.dicebear.com/8.x/lorelei/svg?seed=James&backgroundColor=fef3c7',
    category: 'Minimal',
  },
  {
    id: 'av-lorelei-2',
    label: 'Minimal Female',
    url: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Emma&backgroundColor=ecfdf5',
    category: 'Minimal',
  },
  {
    id: 'av-notionists-1',
    label: 'Illustrated A',
    url: 'https://api.dicebear.com/8.x/notionists/svg?seed=Nick&backgroundColor=fffbeb',
    category: 'Illustrated',
  },
];

interface AvatarUploadProps {
  currentAvatar?: string;
  name: string;
  onSave: (newAvatarUrl: string) => void;
  onClose: () => void;
}

type Tab = 'upload' | 'choose';

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  name,
  onSave,
  onClose,
}) => {
  const [tab, setTab] = useState<Tab>('upload');
  const [preview, setPreview] = useState<string>(currentAvatar || '');
  const [selectedDefault, setSelectedDefault] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED = 'image/jpeg,image/png,image/webp,image/gif';

  // Compress & convert file to data-url for storage (base64)
  const processFile = useCallback((file: File) => {
    if (!file.type.match(/image\/(jpeg|png|webp|gif)/) && !file.name.toLowerCase().endsWith('.gif')) {
      alert('Please upload a valid image file (JPG, PNG, WEBP, or GIF).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit. Please choose a smaller image or GIF.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const raw = reader.result as string;
      // Preserve animated GIFs by not flattening them through canvas 2D rasterization
      if (file.type === 'image/gif' || file.name.toLowerCase().endsWith('.gif')) {
        setPreview(raw);
        setSelectedDefault('');
        return;
      }
      // Use canvas to resize / compress to reasonable size for static photos
      const img = new Image();
      img.onload = () => {
        const MAX = 400;
        const scale = Math.min(MAX / img.width, MAX / img.height, 1);
        const canvas = document.createElement('canvas');
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressed = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.88);
        setPreview(compressed);
        setSelectedDefault('');
      };
      img.src = raw;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleSelectDefault = (url: string, id: string) => {
    setSelectedDefault(id);
    setPreview(url);
  };

  const handleRemove = () => {
    setPreview('');
    setSelectedDefault('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = () => {
    onSave(preview);
  };

  const categories = ['All', ...Array.from(new Set(DEFAULT_AVATARS.map(a => a.category)))];
  const filtered =
    categoryFilter === 'All'
      ? DEFAULT_AVATARS
      : DEFAULT_AVATARS.filter(a => a.category === categoryFilter);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Change profile photo"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden modal-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Camera className="w-4 h-4 text-blue-600" />
            Change Profile Photo
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preview */}
        <div className="flex justify-center pt-6 pb-4">
          <div className="relative">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900 shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center border-4 border-blue-100 dark:border-blue-900 shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
            )}
            {preview && (
              <button
                onClick={handleRemove}
                className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow transition-colors"
                title="Remove photo"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex mx-6 mb-4 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => setTab('upload')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'upload'
                ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5 inline mr-1.5" />
            Upload Photo
          </button>
          <button
            onClick={() => setTab('choose')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'choose'
                ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 inline mr-1.5" />
            Choose Avatar
          </button>
        </div>

        {/* Tab Content */}
        <div className="px-6 pb-2">
          {tab === 'upload' ? (
            <div>
              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 scale-[1.01]'
                    : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED}
                  className="hidden"
                  onChange={handleFileChange}
                  id="avatar-file-input"
                  aria-label="Select profile photo from device"
                />
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center mb-1">
                    <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Click or drag &amp; drop
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    JPG, PNG, WEBP — Max 5MB
                  </p>
                  <button
                    type="button"
                    className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors btn-press"
                    onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  >
                    Browse Files
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-2">
                On mobile, this opens your camera roll / gallery
              </p>
            </div>
          ) : (
            <div>
              {/* Category filter pills */}
              <div className="flex gap-1.5 flex-wrap mb-3">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                      categoryFilter === cat
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-950/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {/* Avatar grid */}
              <div className="grid grid-cols-4 gap-3 max-h-44 overflow-y-auto no-scrollbar pb-1">
                {filtered.map(av => (
                  <button
                    key={av.id}
                    onClick={() => handleSelectDefault(av.url, av.id)}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedDefault === av.id
                        ? 'border-blue-500 scale-105 shadow-md'
                        : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                    }`}
                    title={av.label}
                  >
                    <img
                      src={av.url}
                      alt={av.label}
                      className="w-full aspect-square object-cover bg-slate-100 dark:bg-slate-800"
                    />
                    {selectedDefault === av.id && (
                      <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex gap-3 px-6 pt-4 pb-6 mt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleRemove}
            className="flex-none flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 transition-all btn-press"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors btn-press"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!preview}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all btn-press shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            Save Photo
          </button>
        </div>
      </div>
    </div>
  );
};
