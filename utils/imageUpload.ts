export interface UploadedImage {
  id: string;
  dataUrl: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
}

const IMAGES_KEY = 'agriflow_uploaded_images';

export function getUploadedImages(): UploadedImage[] {
  try {
    const stored = localStorage.getItem(IMAGES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveUploadedImage(image: UploadedImage): UploadedImage[] {
  const images = getUploadedImages();
  const updated = [image, ...images].slice(0, 50);
  try {
    localStorage.setItem(IMAGES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Storage full, removing older images...');
    const trimmed = [image, ...images].slice(0, 20);
    localStorage.setItem(IMAGES_KEY, JSON.stringify(trimmed));
    return trimmed;
  }
  return updated;
}

export function deleteUploadedImage(id: string): UploadedImage[] {
  const images = getUploadedImages();
  const updated = images.filter(img => img.id !== id);
  localStorage.setItem(IMAGES_KEY, JSON.stringify(updated));
  return updated;
}

export function uploadImageFile(file: File): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('Image must be smaller than 5MB'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const image: UploadedImage = {
        id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        dataUrl,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      };
      saveUploadedImage(image);
      resolve(image);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to create preview'));
    reader.readAsDataURL(file);
  });
}
