import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite';

export default defineConfig({
    plugins: [tanstackRouter({ target: 'react', autoCodeSplitting: true }), react()],
    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, './src'),
        },
    },
});
