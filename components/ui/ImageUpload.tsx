import React, { useRef, useState } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { uploadImageFile } from '../../utils/imageUpload';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  shape?: 'square' | 'circle';
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
  className?: string;
}

const sizeMap = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-32 h-32',
};

const iconSizeMap = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-7 h-7',
};

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = 'Upload Image',
  shape = 'square',
  size = 'md',
  placeholder,
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setUseFallback(false);

    try {
      const uploaded = await uploadImageFile(file);
      onChange(uploaded.dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    setUseFallback(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const shapeClass = shape === 'circle' ? 'rounded-full' : 'rounded-xl';
  const hasImage = value && !useFallback;

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div
        className={`relative ${sizeMap[size]} ${shapeClass} overflow-hidden border-2 border-dashed border-terra-300 dark:border-jade-700 bg-terra-50 dark:bg-jade-900/30 shrink-0 group cursor-pointer hover:border-jade-500 transition-colors`}
        onClick={() => inputRef.current?.click()}
        role="button"
        aria-label={label}
      >
        {hasImage ? (
          <>
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
              onError={() => setUseFallback(true)}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Upload className={`${iconSizeMap[size]} text-white`} />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 transition-colors z-10"
              aria-label="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-terra-400 dark:text-jade-500">
            {isUploading ? (
              <div className="animate-spin rounded-full border-2 border-jade-500 border-t-transparent w-6 h-6" />
            ) : (
              <Camera className={`${iconSizeMap[size]} mb-1`} />
            )}
            <span className="text-[9px] font-medium text-center px-1">
              {isUploading ? 'Uploading...' : placeholder || 'Click to upload'}
            </span>
          </div>
        )}
      </div>

      {error && (
        <p className="text-[10px] text-red-500 font-medium">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        aria-label={label}
      />
    </div>
  );
};

export default ImageUpload;
