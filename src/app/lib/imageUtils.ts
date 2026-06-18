import sharp from 'sharp';

const DEFAULT_MAX_SIZE = 2048;
const BG_DISTANCE_THRESHOLD = 46;
const BG_SOFTNESS = 42;

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

async function hasUsefulTransparency(inputBuffer: Buffer): Promise<boolean> {
  const { data, info } = await sharp(inputBuffer, { failOn: 'none' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixelCount = info.width * info.height;
  let transparentPixels = 0;

  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 245) transparentPixels++;
  }

  return transparentPixels / pixelCount > 0.03;
}

function averageCornerColor(data: Buffer, width: number, height: number) {
  const sampleSize = Math.max(8, Math.round(Math.min(width, height) * 0.08));
  const totals = { r: 0, g: 0, b: 0, count: 0 };
  const areas = [
    { xStart: 0, xEnd: sampleSize, yStart: 0, yEnd: sampleSize },
    { xStart: width - sampleSize, xEnd: width, yStart: 0, yEnd: sampleSize },
    { xStart: 0, xEnd: sampleSize, yStart: height - sampleSize, yEnd: height },
    { xStart: width - sampleSize, xEnd: width, yStart: height - sampleSize, yEnd: height },
  ];

  for (const area of areas) {
    for (let y = area.yStart; y < area.yEnd; y++) {
      for (let x = area.xStart; x < area.xEnd; x++) {
        const offset = (y * width + x) * 4;
        totals.r += data[offset];
        totals.g += data[offset + 1];
        totals.b += data[offset + 2];
        totals.count++;
      }
    }
  }

  return {
    r: totals.r / totals.count,
    g: totals.g / totals.count,
    b: totals.b / totals.count,
  };
}

async function removeBackgroundWithSharp(inputBuffer: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(inputBuffer, { failOn: 'none' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const bg = averageCornerColor(data, info.width, info.height);
  const output = Buffer.from(data);

  for (let i = 0; i < output.length; i += 4) {
    const distance = Math.sqrt(
      Math.pow(output[i] - bg.r, 2) +
      Math.pow(output[i + 1] - bg.g, 2) +
      Math.pow(output[i + 2] - bg.b, 2),
    );

    if (distance <= BG_DISTANCE_THRESHOLD) {
      output[i + 3] = 0;
    } else if (distance <= BG_DISTANCE_THRESHOLD + BG_SOFTNESS) {
      const alphaRatio = (distance - BG_DISTANCE_THRESHOLD) / BG_SOFTNESS;
      output[i + 3] = Math.min(output[i + 3], Math.round(255 * alphaRatio));
    }
  }

  return sharp(output, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .median(1)
    .png()
    .toBuffer();
}

export async function removeImageBackground(inputBuffer: Buffer): Promise<Buffer> {
  const normalizedBuffer = await normalizeImageBuffer(inputBuffer);

  try {
    const { removeBackground } = await import('@imgly/background-removal-node');
    const blob = new Blob([new Uint8Array(normalizedBuffer)], { type: 'image/png' });
    const { pathToFileURL } = await import('url');
    const path = await import('path');
    const config = {
      publicPath: `${pathToFileURL(path.resolve('./node_modules/@imgly/background-removal-node/dist/')).href}/`,
    };

    const bgRemBlob = await removeBackground(blob, config);
    const arrayBuffer = await bgRemBlob.arrayBuffer();
    if (arrayBuffer.byteLength <= 1024) {
      throw new Error('Background removal returned an empty image');
    }

    const transparentBuffer = await normalizeImageBuffer(Buffer.from(arrayBuffer));
    if (!(await hasUsefulTransparency(transparentBuffer))) {
      throw new Error('Background removal did not create transparency');
    }

    return transparentBuffer;
  } catch (err) {
    console.warn('AI background removal failed, using sharp fallback:', (err as Error).message);
    return removeBackgroundWithSharp(normalizedBuffer);
  }
}

