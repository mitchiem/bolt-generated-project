import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        'towing-services': 'towing-services.html',
        'roadside-assistance': 'roadside-assistance.html',
        'vehicle-recovery': 'vehicle-recovery.html',
        'heavy-duty-towing': 'heavy-duty-towing.html',
        'emergency-towing': 'emergency-towing.html',
        'service-area': 'service-area.html',
        'about-us': 'about-us.html',
        'contact': 'contact.html',
        'testimonials': 'testimonials.html',
        'blog': 'blog.html',
        'faqs': 'faqs.html',
      },
      output: {
        manualChunks(id) {
          if (id.includes('fetch.worker.a792378e.js')) {
            return 'ignore';
          }
        },
      },
    },
  },
});
