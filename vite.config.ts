import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import fs from 'fs';
const versionData = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace('[version]', versionData.version);
      },
    }
  ],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split('.').pop();

          let folder = 'other';

          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType || '')) {
            folder = 'img';
          } else if (/css/i.test(extType || '')) {
            folder = 'css';
          }

          return `assets/${folder}/${folder === 'css' && 'styles-'}${versionData.version}[extname]`;
        },
        chunkFileNames: `assets/js/script-${versionData.version}.js`,
        entryFileNames: `assets/js/script-${versionData.version}.js`,
      },
    },
  },
});