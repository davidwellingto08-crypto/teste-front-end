import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/produtos': {
        target: 'https://app.econverse.com.br',
        changeOrigin: true,
        secure: true,
        rewrite: () =>
          '/teste-front-end/junior/tecnologia/lista-produtos/produtos.json',
      },
    },
  },
});