import path from 'path';
import fs from 'fs';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [
    {
      name: 'clean-urls-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url) {
            const [pathname, search] = req.url.split('?');
            if (pathname && !pathname.includes('.') && pathname !== '/') {
              const cleanName = pathname.replace(/^\//, '');
              const filePath = path.resolve(__dirname, `${cleanName}.html`);
              if (fs.existsSync(filePath)) {
                req.url = `/${cleanName}.html${search ? '?' + search : ''}`;
              }
            }
          }
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url) {
            const [pathname, search] = req.url.split('?');
            if (pathname && !pathname.includes('.') && pathname !== '/') {
              const cleanName = pathname.replace(/^\//, '');
              const filePath = path.resolve(__dirname, `${cleanName}.html`);
              if (fs.existsSync(filePath)) {
                req.url = `/${cleanName}.html${search ? '?' + search : ''}`;
              }
            }
          }
          next();
        });
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        about: path.resolve(__dirname, 'about.html'),
        projects: path.resolve(__dirname, 'projects.html'),
        service: path.resolve(__dirname, 'service.html'),
        contact: path.resolve(__dirname, 'contact.html'),
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});

