import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  build: {
    rolluexternalpOptions: {
      external: ['@mediapipe/pose']
    }
  },

  optimizeDeps: {
    exclude: ['@mediapipe/pose']
  }
})