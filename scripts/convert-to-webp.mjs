import fs from "fs";
import path from "path";
import sharp from "sharp";

const imagesDir = path.resolve(process.cwd(), "public/images");

/**
 * Recursively scans directory and converts any .jpg, .jpeg, or .png
 * to optimized WebP format with quality 85.
 */
async function convertDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "favicons") {
        await convertDir(fullPath);
      }
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if ([".jpg", ".jpeg", ".png"].includes(ext)) {
        const baseName = path.basename(entry.name, ext);
        const webpPath = path.join(dir, `${baseName}.webp`);
        try {
          await sharp(fullPath)
            .webp({ quality: 85, effort: 4 })
            .toFile(webpPath);
          const origSize = fs.statSync(fullPath).size;
          const newSize = fs.statSync(webpPath).size;
          const reduction = Math.round((1 - newSize / origSize) * 100);
          console.log(`✓ Converted: ${entry.name} (${Math.round(origSize / 1024)}KB) -> ${baseName}.webp (${Math.round(newSize / 1024)}KB) [${reduction}% smaller]`);
        } catch (err) {
          console.error(`✗ Error converting ${fullPath}:`, err.message);
        }
      }
    }
  }
}

async function main() {
  console.log("=== Mother Glory WebP Asset Converter ===");
  console.log(`Target Directory: ${imagesDir}`);
  await convertDir(imagesDir);
  console.log("=== All images converted to WebP successfully! ===");
}

main();

