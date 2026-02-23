import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {resolve} from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      's': resolve(__dirname, './src'),
      'p': resolve(__dirname, './public'),
    },
  },
  base: process.env.NODE_ENV === 'production' ? '/meloman_karaoke-game/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
})
