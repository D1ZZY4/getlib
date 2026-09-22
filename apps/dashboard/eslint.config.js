import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      // eslint-plugin-react-hooks v7 exposes the ESLintrc-style configs
      // (`plugins: ['react-hooks']`) directly; the flat variants live under
      // `configs.flat.*`. The `recommended` (non-experimental) preset is used
      // to match the rules the template shipped with — `recommended-latest`
      // additionally enables aggressive compiler/immutability rules.
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // react-refresh v0.5 raised `only-export-components` from "warn" to
      // "error". Restore the warn-level behavior the project shipped with so
      // existing files (which export helpers alongside components) keep
      // linting clean.
      'react-refresh/only-export-components': 'warn',
    },
  },
])
