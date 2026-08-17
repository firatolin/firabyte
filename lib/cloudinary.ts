import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

/**
 * Upload an image to Cloudinary
 */
export async function uploadImage(file: File | string, folder = 'blog'): Promise<string> {
  try {
    // Convert file to base64 if it's a File object
    let fileData: string;
    if (typeof file === 'string') {
      fileData = file;
    } else {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      // Convert to base64
      fileData = `data:${file.type};base64,${buffer.toString('base64')}`;
    }

    const result = await cloudinary.uploader.upload(fileData, {
      folder: `firabyte/${folder}`,
      use_filename: true,
      unique_filename: true,
      overwrite: true,
      transformation: [
        { quality: 'auto:best' },
        { fetch_format: 'auto' }
      ]
    });

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image');
  }
}

/**
 * Get optimized image URL with transformations
 */
export function getOptimizedImageUrl(
  url: string, 
  options: {
    width?: number;
    height?: number;
    quality?: number;
    crop?: 'fill' | 'fit' | 'limit';
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  } = {}
): string {
  if (!url || !url.includes('cloudinary')) return url;

  const { width, height, quality = 80, crop = 'fit', format = 'auto' } = options;

  let transformations = `q_${quality},f_${format}`;
  if (width && height) {
    transformations += `,w_${width},h_${height},c_${crop}`;
  } else if (width) {
    transformations += `,w_${width}`;
  } else if (height) {
    transformations += `,h_${height}`;
  }

  // Insert transformations into the URL
  const parts = url.split('/upload/');
  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
}

/**
 * Size options for post images
 */
type ImageSize = 'thumbnail' | 'medium' | 'large' | 'full';

interface SizeOptions {
  thumbnail: { width: number; height: number; crop: 'fill' };
  medium: { width: number; height: number; crop: 'fit' };
  large: { width: number; height: number; crop: 'fit' };
  full: { width?: never; height?: never; crop?: never };
}

/**
 * Get a Cloudinary image URL for a post
 */
export function getPostImageUrl(
  imageUrl: string, 
  size: ImageSize = 'medium'
): string {
  const sizes: SizeOptions = {
    thumbnail: { width: 300, height: 200, crop: 'fill' },
    medium: { width: 600, height: 400, crop: 'fit' },
    large: { width: 1200, height: 800, crop: 'fit' },
    full: {},
  };

  const options = sizes[size];
  return getOptimizedImageUrl(imageUrl, options);
}