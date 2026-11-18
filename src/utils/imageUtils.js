// Image processing, validation, and resizing utility

const MAX_RAW_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB safety cap
const MAX_DIMENSION = 1200; // Max width or height in pixels
const JPEG_QUALITY = 0.84; // High visual quality with efficient file compression

/**
 * Validates and compresses an image file into a lightweight base64 Data URL.
 * Ensures the image is not oversized for storage and responsiveness.
 */
export async function processAndOptimizeImage(file) {
  if (!file) {
    throw new Error('No file provided.');
  }

  // Verify mime type
  if (!file.type.startsWith('image/')) {
    throw new Error('Selected file must be an image (PNG, JPG, WebP, GIF, SVG).');
  }

  // Check raw file size limit
  if (file.size > MAX_RAW_FILE_SIZE_BYTES) {
    throw new Error('Image file is too large! Maximum allowed upload size is 10 MB.');
  }

  // SVG images or animated GIFs can be read directly if small
  if (file.type === 'image/svg+xml' || (file.type === 'image/gif' && file.size < 1.5 * 1024 * 1024)) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read image file.'));
      reader.readAsDataURL(file);
    });
  }

  // For JPEG, PNG, WebP: scale down to max dimensions and compress
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale down if exceeds MAX_DIMENSION
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          return resolve(e.target.result); // Fallback to raw data url
        }

        // Draw and export optimized image
        ctx.drawImage(img, 0, 0, width, height);
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
        resolve(optimizedDataUrl);
      };

      img.onerror = () => {
        reject(new Error('Could not parse image. The file may be corrupted.'));
      };

      img.src = e.target.result;
    };

    reader.onerror = () => {
      reject(new Error('Error reading the image file from disk.'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes into human-readable string
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
