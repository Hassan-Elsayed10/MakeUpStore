'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value: string; // current image URL (existing or just uploaded)
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, label, className }: ImageUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    setUploading(true);
    setError('');

    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Upload failed');
      } else {
        onChange(data.url);
      }
    } catch {
      setError('Upload failed. Please try again.');
    }

    setUploading(false);
  }, [onChange]);

  const handleFile = useCallback((file: File | undefined | null) => {
    if (!file) return;
    upload(file);
  }, [upload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
    // Reset so same file can be re-selected
    e.target.value = '';
  };

  const handleRemove = () => {
    onChange('');
    setError('');
  };

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</p>
      )}

      {value ? (
        /* ── Preview ── */
        <div className="relative group w-full aspect-video rounded-xl overflow-hidden border-2 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-contain"
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-neutral-900 rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-neutral-100 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-red-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        /* ── Drop zone ── */
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'relative w-full aspect-video rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-3 transition-all',
            dragging
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30'
              : 'border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-950/20'
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
              <p className="text-sm text-neutral-500">Uploading...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-neutral-400" />
              </div>
              <div className="text-center px-4">
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Drop image here, or{' '}
                  <span className="text-primary-600 dark:text-primary-400">browse</span>
                </p>
                <p className="text-xs text-neutral-400 mt-1">PNG, JPG, WebP up to 5 MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
