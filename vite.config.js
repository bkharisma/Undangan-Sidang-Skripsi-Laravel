import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
    build: {
        modulePreload: false,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('react-dom') || id.includes('/react/') || id.includes('react/jsx-runtime')) {
                            return 'vendor-react';
                        }
                        if (id.includes('@inertiajs')) {
                            return 'vendor-inertia';
                        }
                        if (
                            id.includes('@base-ui') ||
                            id.includes('class-variance-authority') ||
                            id.includes('clsx') ||
                            id.includes('tailwind-merge') ||
                            id.includes('sonner')
                        ) {
                            return 'vendor-ui';
                        }
                        if (id.includes('lucide-react')) {
                            return 'vendor-lucide';
                        }
                        return 'vendor-misc';
                    }
                },
            },
        },
    },
});
