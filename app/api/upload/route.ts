import { NextRequest, NextResponse } from 'next/server';
import { uploadImage, deleteImage } from '@/lib/cloudinary';
import { requireAdmin } from '@/lib/auth-utils';
import { isValidImageFile } from '@/lib/utils';

// Upload image
export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'blog';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check file type (MIME type + magic bytes)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be less than 5MB' }, { status: 400 });
    }

    // Validate magic bytes
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    if (!isValidImageFile(buffer)) {
      return NextResponse.json({ error: 'Invalid image file format' }, { status: 400 });
    }

    const url = await uploadImage(file, folder);

    return NextResponse.json({
      success: true,
      url,
      publicId: url.split('/').pop()?.split('.')[0],
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// Delete image
export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json({ error: 'Public ID required' }, { status: 400 });
    }

    await deleteImage(publicId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}