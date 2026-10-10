import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a URL-friendly slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')  // Support Unicode letters/numbers
    .replace(/^-|-$/g, '');
}

/**
 * Generate a unique slug by appending a number if needed
 */
export async function generateUniqueSlug(
  baseSlug: string,
  checkFn: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  
  while (await checkFn(slug)) {
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
  
  return slug;
}

/**
 * Check if user has admin role
 */
export function isAdmin(role?: string | null): boolean {
  return role === 'ADMIN';
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate file is actually an image by checking magic bytes
 */
export function isValidImageFile(buffer: Buffer): boolean {
  // Check magic bytes for common image formats
  const signatures: [number, number[]][] = [
    [0xFF, [0xD8, 0xFF]], // JPEG
    [0x89, [0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]], // PNG
    [0x47, [0x49, 0x46, 0x38]], // GIF (GIF87a/GIF89a)
    [0x52, [0x49, 0x46, 0x46]], // WebP (RIFF)
    [0x00, [0x00, 0x01, 0x00]], // ICO
    [0x42, [0x4D]], // BMP
  ];
  
  for (const [firstByte, restBytes] of signatures) {
    if (buffer[0] === firstByte && restBytes.every((b, i) => buffer[i + 1] === b)) {
      return true;
    }
  }
  return false;
}