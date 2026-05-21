import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
build: {
  chunkSizeWarningLimit: 1000
}
export default defineConfig({
  plugins: [react()],
})
