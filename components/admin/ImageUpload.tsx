'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { FaUpload, FaTimes, FaSpinner } from 'react-icons/fa';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  onRemove?: () => void;
  currentImage?: string;
  folder?: string;
}

export function ImageUpload({ onUpload, onRemove, currentImage, folder = 'blog' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setPreview(data.url);
      onUpload(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (onRemove) onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {preview ? (
        <div className="relative group w-full max-w-md">
          <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
            <Image
              src={preview}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
          </div>
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Remove image"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center w-full max-w-md aspect-video border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors cursor-pointer bg-accent/10 hover:bg-accent/20"
        >
          {isUploading ? (
            <FaSpinner className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <>
              <FaUpload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload cover image</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, WebP (max 5MB)</p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
    </div>
  );
}