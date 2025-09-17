import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const ReactCompilerConfig = { }

const aliases = {
    "@": resolve("./src"),
    "@components": resolve("./src/components"),
    "@icons": resolve("./src/components/icons"),
    "@assets": resolve("./assets"),
    "@pages": resolve("./src/pages"),
    "@api": resolve("./src/api"),
    "@localization": resolve("./src/localization/Localization.ts"),
    "@extensions": resolve("./src/extensions")
}

for (const [alias, path] of Object.entries(aliases)) {
    console.log(`Alias: ${alias} -> ${path}`)
}

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
            "@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs",
            ...aliases
        }
    }
})
