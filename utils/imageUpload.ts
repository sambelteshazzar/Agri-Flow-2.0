import { db, DB_KEYS } from '@/services/persistence';

export interface UploadedImage {
  id: string;
  dataUrl: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

const IMAGES_KEY = 'agriflow_uploaded_images';

export async function getUploadedImages(): Promise<UploadedImage[]> {
  return db.getItem<UploadedImage[]>(IMAGES_KEY, []);
}

export async function saveUploadedImage(image: UploadedImage): Promise<UploadedImage[]> {
  const images = await getUploadedImages();
  const updated = [image, ...images].slice(0, 200); // Keep max 200 images
  await db.setItem(IMAGES_KEY, updated);
  return updated;
}

export async function deleteUploadedImage(id: string): Promise<UploadedImage[]> {
  const images = await getUploadedImages();
  const updated = images.filter(img => img.id !== id);
  await db.setItem(IMAGES_KEY, updated);
  return updated;
}

export async function uploadImageFile(file: File): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      const image: UploadedImage = {
        id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        dataUrl,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      };
      await saveUploadedImage(image);
      resolve(image);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function validateImageFile(file: File, maxSizeMB = 5): { valid: boolean; error?: string } {
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `Image must be smaller than ${maxSizeMB}MB` };
  }
  return { valid: true };
}

export function getImageDataUrl(imageId: string): string | null {
  // For sync access, we can't use async db.getItem
  // This is a fallback for synchronous needs
  try {
    const stored = localStorage.getItem(IMAGES_KEY);
    if (stored) {
      const images = JSON.parse(stored) as UploadedImage[];
      const img = images.find(i => i.id === imageId);
      return img?.dataUrl || null;
    }
  } catch {}
  return null;
}

export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('Failed to create preview'));
    reader.readAsDataURL(file);
  });
}