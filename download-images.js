import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mediaData = JSON.parse(fs.readFileSync(path.join(__dirname, '_data', 'media.json'), 'utf8'));
const imagesDir = path.join(__dirname, 'assets', 'images');

async function downloadImage(url, filename) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const filePath = path.join(imagesDir, filename);
    fs.writeFileSync(filePath, response.data);
    console.log(`✓ Downloaded: ${filename}`);
  } catch (error) {
    console.error(`✗ Failed to download ${filename}:`, error.message);
  }
}

async function downloadAllImages() {
  console.log(`🖼️  Downloading ${mediaData.length} images...\n`);

  for (const media of mediaData) {
    const urlParts = media.url.split('/');
    const filename = urlParts[urlParts.length - 1];
    await downloadImage(media.url, filename);
  }

  console.log('\n✅ Image download complete!');
}

downloadAllImages().catch(console.error);
