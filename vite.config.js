import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
    plugins: [
        tailwindcss({
            configPath: './tailwind.config.js'
        }),
    ],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                application: resolve(__dirname, 'application.html'),
                documents: resolve(__dirname, 'documents.html'),
                funding: resolve(__dirname, 'funding.html'),
                reports: resolve(__dirname, 'reports.html'),
                scholars: resolve(__dirname, 'scholars.html'),
                settings: resolve(__dirname, 'setting.html'),
                test: resolve(__dirname, 'test.html'),
            }
        }
    }
})