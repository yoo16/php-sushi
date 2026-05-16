import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');

  return {
    root: path.resolve(__dirname),
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost/php-sushi/backend',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: path.resolve(__dirname, 'js/dist'),
      emptyOutDir: true,
      manifest: true,
      assetsDir: 'assets',
    },
  };
});
