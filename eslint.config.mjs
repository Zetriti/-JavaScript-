import js from '@eslint/js'
import globals from 'globals'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
    {
        files: ['**/*.{js,mjs,cjs}'],
        plugins: {
            prettier: prettierPlugin,
        },
        languageOptions: {
            globals: globals.browser,
        },
        rules: {
            ...js.configs.recommended.rules,
            'prettier/prettier': 'error',
        },
    },
    prettierConfig,
]
