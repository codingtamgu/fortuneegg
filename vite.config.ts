import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoBase = '/fortuneegg/';

export default defineConfig({
  base: repoBase,
  plugins: [react()],
});
