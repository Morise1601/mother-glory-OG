/**
 * Client-side image converter utility.
 * Automatically converts any selected PNG/JPG/JPEG into an optimized WebP blob and File
 * in the browser before network transmission.
 */

export interface ConvertedImageResult {
  file: File;
  blob: Blob;
  dataUrl: string;
  originalName: string;
  originalSize: number;
  newSize: number;
  width: number;
  height: number;
}

export async function convertImageFileToWebp(
  file: File,
  quality = 0.85,
  maxWidth = 1920,
  maxHeight = 1920
): Promise<ConvertedImageResult> {
  // If already webp and reasonably sized, we can still load to ensure dimensions
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio if larger than bounds
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Unable to create canvas context for image conversion."));
          return;
        }

        // Draw image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas to WebP blob conversion failed."));
              return;
            }

            const cleanBaseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
            const newFileName = `${cleanBaseName}.webp`;
            const webpFile = new File([blob], newFileName, {
              type: "image/webp",
              lastModified: Date.now(),
            });

            const webpDataUrl = canvas.toDataURL("image/webp", quality);

            resolve({
              file: webpFile,
              blob,
              dataUrl: webpDataUrl,
              originalName: file.name,
              originalSize: file.size,
              newSize: blob.size,
              width,
              height,
            });
          },
          "image/webp",
          quality
        );
      };

      img.onerror = () => {
        reject(new Error("Failed to load image for WebP conversion."));
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file for conversion."));
    };

    reader.readAsDataURL(file);
  });
}

