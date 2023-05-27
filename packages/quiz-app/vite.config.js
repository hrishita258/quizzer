import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  build: {
    outDir: 'build'
  },
  resolve: {
    alias: { json2csv: 'json2csv/dist/json2csv.umd.js' }
  },
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
})
