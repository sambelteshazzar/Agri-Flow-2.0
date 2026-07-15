import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const nvidiaKey = env.VITE_NVIDIA_API_KEY || '';
    return {
      base: '/',
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.API_KEY),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      server: {
        port: 3000,
        host: '0.0.0.0',
        // In local dev, /api/ai-chat is proxied directly to NVIDIA with auth
        // injected from .env.local. In production (Vercel), the request is
        // handled by the api/ai-chat.ts serverless function (server-side, no CORS).
        proxy: {
          '/api/ai-chat': {
            target: 'https://integrate.api.nvidia.com/v1/chat/completions',
            changeOrigin: true,
            rewrite: () => '',
            configure: (proxy) => {
              proxy.on('proxyReq', (proxyReq) => {
                proxyReq.setHeader('Authorization', `Bearer ${nvidiaKey}`);
                proxyReq.setHeader('Content-Type', 'application/json');
              });
            },
          },
        },
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: undefined,
          },
        },
      },
    };
});
