import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

async function generateHostingZip() {
  console.log('📦 Generating hosting-dist.zip for Plesk / cPanel hosting...');

  const zip = new JSZip();
  const distDir = path.join(process.cwd(), 'dist');
  const publicDir = path.join(process.cwd(), 'public');

  function addDirToZip(dirPath, zipFolder) {
    if (!fs.existsSync(dirPath)) return;
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      if (item.endsWith('.zip') || item.startsWith('server.cjs')) continue;
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const subFolder = zipFolder.folder(item);
        addDirToZip(fullPath, subFolder);
      } else {
        const content = fs.readFileSync(fullPath);
        zipFolder.file(item, content);
      }
    }
  }

  // 1. Add all static frontend files from dist/ (the compiled SPA)
  if (fs.existsSync(distDir)) {
    addDirToZip(distDir, zip);
  }

  // 2. Add PHP hosting files, database schema, and htaccess from public/
  const rootPublicFiles = ['index.php', 'api.php', 'database.sql', '.htaccess', 'og-image-round.jpg', 'custom-og-image.jpg', 'apple-touch-icon.png'];
  for (const file of rootPublicFiles) {
    const pubFilePath = path.join(publicDir, file);
    if (fs.existsSync(pubFilePath)) {
      zip.file(file, fs.readFileSync(pubFilePath));
    }
  }

  // 3. Add data folder and all its contents (mapel OG configs & uploaded images)
  const dataZipFolder = zip.folder('data');
  dataZipFolder.file('.gitkeep', '');
  const pubDataDir = path.join(publicDir, 'data');
  if (fs.existsSync(pubDataDir)) {
    addDirToZip(pubDataDir, dataZipFolder);
  }

  // 3. Generate ZIP content and write to public/hosting-dist.zip and dist/hosting-dist.zip
  const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  
  const publicZipPath = path.join(publicDir, 'hosting-dist.zip');
  fs.writeFileSync(publicZipPath, content);

  if (fs.existsSync(distDir)) {
    const distZipPath = path.join(distDir, 'hosting-dist.zip');
    fs.writeFileSync(distZipPath, content);
  }

  console.log(`✅ hosting-dist.zip successfully created (${(content.length / 1024 / 1024).toFixed(2)} MB)`);
}

generateHostingZip().catch(err => {
  console.error('❌ Failed to create hosting-dist.zip:', err);
  process.exit(1);
});
