import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const ReactCompilerConfig = { }

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [
                    ["babel-plugin-react-compiler", ReactCompilerConfig],
                ],
            }
        })
    ],
    resolve: {
        alias: {
            "@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs"
        }
    }
})
