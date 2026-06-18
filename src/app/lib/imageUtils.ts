import sharp from 'sharp';

const DEFAULT_MAX_SIZE = 2048;

export async function normalizeImageBuffer(
  inputBuffer: Buffer,
  maxSize = DEFAULT_MAX_SIZE,
): Promise<Buffer> {
  if (!inputBuffer.length) {
    throw new Error('Uploaded image is empty');
  }

  return sharp(inputBuffer, { failOn: 'none', limitInputPixels: false })
    .rotate()
    .resize(maxSize, maxSize, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .png()
    .toBuffer();
}

export async function normalizeImageFile(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer();
  return normalizeImageBuffer(Buffer.from(arrayBuffer));
}

