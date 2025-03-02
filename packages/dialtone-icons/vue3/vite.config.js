import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import { resolve } from 'path';
import { glob } from 'glob';
import dts from 'vite-plugin-dts';

const iconEntries = glob.sync('../src/icons/*.vue').reduce((entries, path) => {
  const entryName = path.replace(/^\.\.\/src\/icons\/(.*)\.vue$/, 'components/$1');
  entries[entryName] = path;
  return entries;
}, {});

const illustrationEntries = glob.sync('../src/illustrations/*.vue').reduce((entries, path) => {
  const entryName = path.replace(/^\.\.\/src\/illustrations\/(.*)\.vue$/, 'components/$1');
  entries[entryName] = path;
  return entries;
}, {});
export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: {
        ...iconEntries,
        ...illustrationEntries,
        'dialtone-icons': resolve(__dirname, '../index.js'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        minifyInternalExports: true,
      },
    },
    minify: true,
  },
  plugins: [
    vue(),
    dts({ outDir: 'dist/types' }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('../', import.meta.url)),
    },
  },
});
