export const getImageUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath) return '/images/no-image.png';
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  const baseUrl = import.meta.env.VITE_API_URL || '';
  
  if (!baseUrl && import.meta.env.DEV) {
    console.warn('VITE_API_URL is not set in environment variables');
  }
  
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  const cleanImagePath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${cleanBaseUrl}${cleanImagePath}`;
};