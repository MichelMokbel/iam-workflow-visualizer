import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// CHANGE "iam-workflow-visualizer" to your repo name
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/iam-workflow-visualizer/' : '/', // very important for GitHub Pages
  build: {
    outDir: 'docs', // GitHub Pages will serve from /docs
  },
}))
