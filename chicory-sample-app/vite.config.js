import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import chicory from '../vite-plugin/vite-plugin-chicory'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    chicory(),
    preact(),
  ],
})
